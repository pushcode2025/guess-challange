<template>
  <div class="result-screen" v-if="isFinalResult" :class="{ win: state.status === 'won', lose: state.status === 'lost' }">
    <!-- Confetti Canvas -->
    <canvas ref="confettiCanvas" class="confetti-canvas" v-if="state.status === 'won'"></canvas>

    <!-- Animated Background Elements -->
    <div class="bg-elements">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- Main Container -->
    <div class="result-wrapper" :class="{ win: state.status === 'won', lose: state.status === 'lost' }">

      <!-- Header -->
      <div class="result-header">
        <div class="result-icon-container">
          <div class="result-icon">
            {{ resultIcon }}
          </div>
        </div>

        <h1 class="result-title">
          {{ $t(resultTitleKey) }}
        </h1>

        <p class="result-subtitle">
          {{ $t(resultMessageKey) }}
        </p>
      </div>

      <!-- Main Content Grid -->
      <div class="result-content">

        <!-- Player Card - Featured -->
        <div class="player-card">
         <div class="player-photo-wrapper">
  <div class="photo-frame">
    <responsive-image
      v-if="state.entity?.image_url"
      :src="state.entity?.image_url"
      alt="Player Photo"
      :quality="100"
      fit="cover"
    />
    <responsive-image
      v-else
      src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400"
      alt="Player Photo"
      :quality="80"
      fit="cover"
    />
    <div class="photo-overlay"></div>
  </div>
</div>

          <div class="player-info">
            <p class="info-label">{{ $t('answerWas') }}</p>
            <h2 class="player-name">{{ state.entity?.name }}</h2>
            <p class="player-description">{{ state.entity?.description }}</p>
          </div>

          <!-- Player Attributes -->
          <div class="player-attributes">
            <div class="attribute-item">
              <span class="attribute-icon">🌍</span>
              <div class="attribute-content">
                <span class="attribute-label">{{ $t('nationality') }}</span>
                <span class="attribute-value">{{ state.entity?.attributes?.nationality || '-' }}</span>
              </div>
            </div>

            <div class="attribute-item">
              <span class="attribute-icon">🏆</span>
              <div class="attribute-content">
                <span class="attribute-label">{{ $t('league') }}</span>
                <span class="attribute-value">{{ state.entity?.attributes?.league || '-' }}</span>
              </div>
            </div>

            <div class="attribute-item">
              <span class="attribute-icon">⚽</span>
              <div class="attribute-content">
                <span class="attribute-label">{{ $t('club') }}</span>
                <span class="attribute-value">{{ state.entity?.attributes?.currentTeam || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon-wrapper">
              <span class="stat-icon">⏱️</span>
            </div>
            <div class="stat-content">
              <span class="stat-label">{{ $t('time') }}</span>
              <span class="stat-value">{{ formatTime(timeElapsed) }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper">
              <span class="stat-icon">📊</span>
            </div>
            <div class="stat-content">
              <span class="stat-label">{{ $t('numberOfAskedQuestions') }}</span>
              <span class="stat-value">{{ state.questionsAsked ?? 0 }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="handlePlayAgain" class="btn btn-primary">
          <span class="btn-icon">🔄</span>
          <span class="btn-text">{{ $t('playAgain') }}</span>
        </button>
        <button @click="handleViewLeaderboard" class="btn btn-secondary">
          <span class="btn-icon">🏆</span>
          <span class="btn-text">{{ $t('viewLeaderboard') }}</span>
        </button>
        <button @click="handleBackToMenu" class="btn btn-secondary">
          <span class="btn-icon">🏠</span>
          <span class="btn-text">{{ $t('mainMenu') }}</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import ResponsiveImage from './ResponsiveImage.vue';
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useGameStore } from '../stores/game';
import { useThemeStore } from '../stores/theme';
import { createConfetti, updateParticle, renderConfetti, type ConfettiParticle } from '../utils/confetti';
import { useRouter, useRoute } from 'vue-router';







const { t: $t } = useI18n();
const router = useRouter();
const route = useRoute();
const loseReason = computed(() => {
  return typeof route.query.reason === 'string'
    ? route.query.reason
    : null;
});
const isTimeUpLoss = computed(() => loseReason.value === 'time_up');

const resultTitleKey = computed(() => {
  if (state.value.status === 'won') {
    return 'youGuessedRightTitle';
  }

  if (isTimeUpLoss.value) {
    return 'timeUpTitle';
  }

  return 'youGuessedWrongTitle';
});

const resultMessageKey = computed(() => {
  if (state.value.status === 'won') {
    return 'youGuessedRightMessage';
  }

  if (isTimeUpLoss.value) {
    return 'timeUpMessage';
  }

  return 'youGuessedWrongMessage';
});

const resultIcon = computed(() => {
  if (state.value.status === 'won') return '🏆';
  if (isTimeUpLoss.value) return '⏱️';
  return '😔';
});

const emit = defineEmits<{
  playAgain: [];
  viewLeaderboard: [];
  backToMenu: [];
}>();

const storageUrl = import.meta.env.VITE_STORAGE_URL;


const gameStore = useGameStore();
const themeStore = useThemeStore();

const { state, timeElapsed, askedQuestionsCount } = storeToRefs(gameStore);

const isFinalResult = computed(() =>
  state.value.status === 'won' || state.value.status === 'lost'
);
const { animationsEnabled } = storeToRefs(themeStore);
const { playSound } = themeStore;
watch(
  () => state.value.status,
  (status) => {

    if (status !== 'won' && status !== 'lost') {
      router.replace({ name: 'home' });
      return;
    }

    if (!state.value.entity) {
      router.replace({ name: 'home' });
      return;
    }

    if (status === 'won') {
      playSound('win');
    } else {
      playSound('lose');
    }
  },
  { immediate: true }
);

const confettiCanvas = ref<HTMLCanvasElement | null>(null);

let confettiParticles: ConfettiParticle[] = [];
let animationFrameId: number | null = null;
let lastTime = 0;

const formatTime = computed(() => {
  return (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
});

function handlePlayAgain() {
  playSound('click');
  router.push({ name: 'home' });
}

function handleViewLeaderboard() {
  playSound('click');
  router.push({ name: "leaderboard" });
}

function handleBackToMenu() {
  playSound('click');
  router.push({ name: 'home' });
}

function animateConfetti(currentTime: number) {
  if (!confettiCanvas.value || !animationsEnabled.value) return;

  const deltaTime = lastTime ? (currentTime - lastTime) / 16 : 1;
  lastTime = currentTime;

  const ctx = confettiCanvas.value.getContext('2d');
  if (!ctx) return;

  confettiParticles = confettiParticles
    .map(p => updateParticle(p, deltaTime))
    .filter(p => p.y < window.innerHeight && p.opacity > 0);

  renderConfetti(ctx, confettiParticles);

  if (confettiParticles.length > 0) {
    animationFrameId = requestAnimationFrame(animateConfetti);
  }
}

onMounted(() => {
  if (state.value.status === 'won' && confettiCanvas.value && animationsEnabled.value) {
    confettiCanvas.value.width = window.innerWidth;
    confettiCanvas.value.height = window.innerHeight;
    confettiParticles = createConfetti();
    animationFrameId = requestAnimationFrame(animateConfetti);
  }
});

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
/* Base Screen */
.result-screen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background 0.8s ease;
}

/* Win Background - Vibrant Green/Gold */
/* Win Background - Subtle Green Tint */
.result-screen.win {
  background: radial-gradient(ellipse at top, #334155 0%, #1e293b 50%, #0f172a 100%);
}

.result-screen.win::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.15), transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(52, 211, 153, 0.12), transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.08), transparent 60%);
  pointer-events: none;
  animation: winPulse 3s ease-in-out infinite;
}

/* Lose Background - Soft Red/Dark */
/* Lose Background - Very Subtle Red Tint */
.result-screen.lose {
  background: radial-gradient(ellipse at top, #334155 0%, #1e293b 50%, #0f172a 100%);
}

.result-screen.lose::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(248, 113, 113, 0.12), transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(239, 68, 68, 0.08), transparent 50%);
  pointer-events: none;
  animation: losePulse 3s ease-in-out infinite;
}

@keyframes winPulse {

  0%,
  100% {
    filter: brightness(1) saturate(1);
  }

  50% {
    filter: brightness(1.15) saturate(1.2);
  }
}

@keyframes losePulse {

  0%,
  100% {
    filter: brightness(0.85) saturate(1);
  }

  50% {
    filter: brightness(0.7) saturate(0.9);
  }
}

/* Animated Background Elements */
.bg-elements {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(80px);
}

.result-screen.win .circle-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #10b981, transparent);
  top: -200px;
  left: -200px;
  animation: floatWin1 20s ease-in-out infinite;
}

.result-screen.win .circle-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #34d399, transparent);
  bottom: -150px;
  right: -150px;
  animation: floatWin2 15s ease-in-out infinite;
}

.result-screen.win .circle-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #fbbf24, transparent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: floatWin3 18s ease-in-out infinite;
}

.result-screen.lose .circle-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #f87171, transparent);
  top: -200px;
  right: -200px;
  animation: floatLose1 20s ease-in-out infinite;
}

.result-screen.lose .circle-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #ef4444, transparent);
  bottom: -150px;
  left: -150px;
  animation: floatLose2 15s ease-in-out infinite;
}

.result-screen.lose .circle-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #dc2626, transparent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: floatLose3 18s ease-in-out infinite;
}

@keyframes floatWin1 {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(100px, 100px) scale(1.1);
  }
}

@keyframes floatWin2 {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-80px, -80px) scale(1.15);
  }
}

@keyframes floatWin3 {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes floatLose1 {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-50px, 50px) scale(0.95);
  }
}

@keyframes floatLose2 {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(60px, -60px) scale(0.9);
  }
}

@keyframes floatLose3 {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(0.85);
  }
}

.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100000;
}

/* Main Wrapper */
.result-wrapper {
  width: 100%;
  max-width: min(1400px, 95vw);
  max-height: 95vh;
  height: 100%;
  display: flex;
  flex-direction: column;


  position: relative;
  z-index: 1;
}

.result-wrapper.win {
  animation: winEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-wrapper.lose {
  animation: loseEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes winEntrance {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(50px) rotate(-5deg);
  }

  60% {
    transform: scale(1.05) translateY(-10px) rotate(2deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateY(0) rotate(0deg);
  }
}

@keyframes loseEntrance {
  0% {
    opacity: 0;
    transform: scale(1.1) translateY(-30px);
  }

  50% {
    transform: scale(0.95) translateY(10px);
  }

  70% {
    transform: scale(1.02) translateY(-5px);
  }

  85% {
    transform: scale(0.98) translateY(3px);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Header */
.result-header {
  text-align: center;
}

.result-wrapper.win .result-header {
  animation: winSlideDown 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-wrapper.lose .result-header {
  animation: loseShake 0.8s ease-out;
}

@keyframes winSlideDown {
  0% {
    opacity: 0;
    transform: translateY(-100px) scale(0.5);
  }

  70% {
    transform: translateY(10px) scale(1.1);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes loseShake {

  0%,
  100% {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-8px) translateY(-5px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(8px) translateY(5px);
  }
}


.result-icon {
  font-size: 6rem;
  display: inline-block;
  filter: drop-shadow(0 15px 40px rgba(0, 0, 0, 0.5));
}

.result-wrapper.win .result-icon {
  animation: winIconSpin 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-wrapper.lose .result-icon {
  animation: loseIconDrop 1s ease-out;
}

@keyframes winIconSpin {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-360deg);
  }

  70% {
    transform: scale(1.2) rotate(20deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes loseIconDrop {
  0% {
    opacity: 0;
    transform: translateY(-100px) scale(1.5) rotate(0deg);
  }

  60% {
    transform: translateY(10px) scale(0.9) rotate(-10deg);
  }

  80% {
    transform: translateY(-5px) scale(1.05) rotate(5deg);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

.result-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0 0.5rem 0;
  letter-spacing: -2px;
  line-height: 1;
}

.result-wrapper.win .result-title {
  background: linear-gradient(135deg, #fbbf24 0%, #10b981 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: winGradientShift 3s ease infinite;
  filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.4));
}

.result-wrapper.lose .result-title {
  color: #9ca3af;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  animation: loseFadeIn 0.8s ease-out;
}

@keyframes winGradientShift {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes loseFadeIn {
  from {
    opacity: 0;
    filter: blur(10px);
  }

  to {
    opacity: 1;
    filter: blur(0);
  }
}

.result-subtitle {
  font-size: 1.125rem;
  margin-top: 1rem;
  font-weight: 500;
  text-align: center;
  width: 100%;
}

.result-wrapper.win .result-subtitle {
  color: #d1fae5;
  text-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
}

.result-wrapper.lose .result-subtitle {
  color: #6b7280;
}

/* Main Content */
.result-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;

  min-height: 0;
}

.result-wrapper.win .result-content {
  animation: winContentSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
}

.result-wrapper.lose .result-content {
  animation: loseContentSlide 0.8s ease-out 0.3s backwards;
}

@keyframes winContentSlide {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes loseContentSlide {
  from {
    opacity: 0;
    transform: translateY(30px);
    filter: blur(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* Player Card */
.player-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(30px);
  border-radius: 24px;
  padding: 2rem;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 2rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.result-wrapper.win .player-card {
  border: 2px solid rgba(16, 185, 129, 0.4);
  box-shadow:
    0 0 60px rgba(16, 185, 129, 0.3),
    inset 0 0 60px rgba(16, 185, 129, 0.05);
}

.result-wrapper.lose .player-card {
  border: 2px solid rgba(248, 113, 113, 0.25);
  box-shadow:
    0 0 60px rgba(248, 113, 113, 0.15),
    inset 0 0 60px rgba(248, 113, 113, 0.03);
}

.player-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.result-wrapper.win .player-card::before {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(251, 191, 36, 0.1));
}

.result-wrapper.lose .player-card::before {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(127, 29, 29, 0.05));
}

.player-card:hover::before {
  opacity: 1;
}

.result-wrapper.win .player-card:hover {
  transform: translateY(-8px) scale(1.01);
  border-color: rgba(16, 185, 129, 0.6);
  box-shadow:
    0 0 80px rgba(16, 185, 129, 0.5),
    inset 0 0 80px rgba(16, 185, 129, 0.08);
}

.result-wrapper.lose .player-card:hover {
  transform: translateY(-4px);
  border-color: rgba(239, 68, 68, 0.4);
}

.player-photo-wrapper {
  grid-row: 1 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-frame {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.result-wrapper.win .photo-frame {
  border: 4px solid rgba(16, 185, 129, 0.6);
  box-shadow:
    0 0 60px rgba(16, 185, 129, 0.6),
    0 20px 80px rgba(0, 0, 0, 0.5);
  animation: winPhotoReveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s backwards;
}

.result-wrapper.lose .photo-frame {
  border: 4px solid rgba(248, 113, 113, 0.3);
  box-shadow:
    0 0 40px rgba(248, 113, 113, 0.3),
    0 20px 60px rgba(0, 0, 0, 0.6);
  animation: losePhotoReveal 1s ease-out 0.5s backwards;
  filter: grayscale(0.2);
}

@keyframes winPhotoReveal {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }

  70% {
    transform: scale(1.15) rotate(10deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes losePhotoReveal {
  0% {
    opacity: 0;
    transform: scale(1.2);
    filter: blur(20px) grayscale(1);
  }

  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0) grayscale(0.3);
  }
}

.player-card:hover .photo-frame {
  transform: scale(1.05) rotate(2deg);
}

.result-wrapper.lose .player-card:hover .photo-frame {
  transform: scale(1.02);
}

.player-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.photo-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.result-wrapper.win .photo-overlay {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), transparent);
  opacity: 0;
}

.result-wrapper.lose .photo-overlay {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), transparent);
  opacity: 0.5;
}

.player-card:hover .player-photo {
  transform: scale(1.1);
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.info-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  margin: 0;
}

.result-wrapper.win .info-label {
  color: #6ee7b7;
}

.result-wrapper.lose .info-label {
  color: #6b7280;
}

.player-name {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -1px;
  line-height: 1.1;
}

.result-wrapper.win .player-name {
  background: linear-gradient(135deg, #fbbf24, #f1f5f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 10px rgba(251, 191, 36, 0.3));
}

.result-wrapper.lose .player-name {
  color: #9ca3af;
}

.player-description {
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

.result-wrapper.win .player-description {
  color: #a7f3d0;
}

.result-wrapper.lose .player-description {
  color: #6b7280;
}

.player-attributes {
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.attribute-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.result-wrapper.win .attribute-item {
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.result-wrapper.win .attribute-item:hover {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

.result-wrapper.lose .attribute-item {
  border: 1px solid rgba(248, 113, 113, 0.15);
}

.result-wrapper.lose .attribute-item:hover {
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.25);
  transform: translateY(-2px);
}

.attribute-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.attribute-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.attribute-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.result-wrapper.win .attribute-label {
  color: #6ee7b7;
}

.result-wrapper.lose .attribute-label {
  color: #6b7280;
}

.attribute-value {
  font-size: 1.125rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-wrapper.win .attribute-value {
  color: #f1f5f9;
}

.result-wrapper.lose .attribute-value {
  color: #9ca3af;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(30px);
  border-radius: 20px;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.stat-card:nth-child(1) {
  animation-delay: 0.5s;
}

.stat-card:nth-child(2) {
  animation-delay: 0.6s;
}

.result-wrapper.win .stat-card {
  border: 2px solid rgba(16, 185, 129, 0.3);
  animation: winStatPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.result-wrapper.lose .stat-card {
  border: 2px solid rgba(248, 113, 113, 0.2);
  animation: loseStatFade 0.8s ease-out backwards;
}

@keyframes winStatPop {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-15deg);
  }

  70% {
    transform: scale(1.1) rotate(5deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes loseStatFade {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.result-wrapper.win .stat-card::before {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(251, 191, 36, 0.1));
}

.result-wrapper.lose .stat-card::before {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent);
}

.result-wrapper.win .stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(16, 185, 129, 0.6);
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4);
}

.result-wrapper.lose .stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 10px 40px rgba(239, 68, 68, 0.2);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon-wrapper {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 1;
}

.result-wrapper.win .stat-icon-wrapper {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(251, 191, 36, 0.2));
  border: 2px solid rgba(16, 185, 129, 0.5);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
}

.result-wrapper.lose .stat-icon-wrapper {
  background: rgba(248, 113, 113, 0.12);
  border: 2px solid rgba(248, 113, 113, 0.25);
}

.result-wrapper.win .stat-card:hover .stat-icon-wrapper {
  transform: rotate(-15deg) scale(1.15);
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.5);
}

.result-wrapper.lose .stat-card:hover .stat-icon-wrapper {
  transform: scale(1.05);
}

.stat-icon {
  font-size: 2.25rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.result-wrapper.win .stat-label {
  color: #6ee7b7;
}

.result-wrapper.lose .stat-label {
  color: #6b7280;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1;
}

.result-wrapper.win .stat-value {
  color: #fbbf24;
  text-shadow: 0 2px 20px rgba(251, 191, 36, 0.4);
}

.result-wrapper.lose .stat-value {
  color: #9ca3af;
}

/* Action Buttons */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.result-wrapper.win .action-buttons {
  animation: winButtonsSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
}

.result-wrapper.lose .action-buttons {
  animation: loseButtonsSlide 0.8s ease-out 0.6s backwards;
}

@keyframes winButtonsSlide {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes loseButtonsSlide {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn {
  padding: 1.5rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn:hover::before {
  transform: translateX(100%);
}

.btn-primary {
  color: white;
  font-size: 1.125rem;
  padding: 1.75rem 2.5rem;
}

.result-wrapper.win .btn-primary {
  background: linear-gradient(135deg, #10b981, #059669, #047857);
  box-shadow: 0 15px 50px rgba(16, 185, 129, 0.5);
  border: 2px solid rgba(16, 185, 129, 0.5);
}

.result-wrapper.win .btn-primary:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 25px 70px rgba(16, 185, 129, 0.7);
  background: linear-gradient(135deg, #059669, #047857, #065f46);
}

.result-wrapper.lose .btn-primary {
  background: linear-gradient(135deg, #f87171, #ef4444, #dc2626);
  box-shadow: 0 15px 50px rgba(248, 113, 113, 0.35);
  border: 2px solid rgba(248, 113, 113, 0.35);
}

.result-wrapper.lose .btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(248, 113, 113, 0.45);
}

.btn-primary:active {
  transform: translateY(-2px) scale(0.98);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  backdrop-filter: blur(10px);
}

.result-wrapper.win .btn-secondary {
  border: 2px solid rgba(16, 185, 129, 0.3);
}

.result-wrapper.win .btn-secondary:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.6);
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(16, 185, 129, 0.3);
  color: #f1f5f9;
}

.result-wrapper.lose .btn-secondary {
  border: 2px solid rgba(248, 113, 113, 0.2);
}

.result-wrapper.lose .btn-secondary:hover {
  background: rgba(248, 113, 113, 0.12);
  border-color: rgba(248, 113, 113, 0.35);
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(248, 113, 113, 0.2);
}

.btn-secondary:active {
  transform: translateY(-2px) scale(0.98);
}

.btn-icon {
  font-size: 1.5rem;
}

.btn-text {
  position: relative;
  z-index: 1;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .result-wrapper {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .result-title {
    font-size: 3rem;
  }

  .result-icon {
    font-size: 5rem;
  }

  .player-name {
    font-size: 2rem;
  }

  .photo-frame {
    width: 180px;
    height: 180px;
  }

  .player-attributes {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .result-wrapper {
    padding: 1.5rem;
    gap: 1.5rem;
    max-height: none;
    overflow-y: auto;
  }

  .result-title {
    font-size: 2.5rem;
  }

  .result-icon {
    font-size: 4rem;
  }

  .result-content {
    gap: 1.5rem;
  }

  .player-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .player-photo-wrapper {
    grid-row: 1;
  }

  .photo-frame {
    width: 160px;
    height: 160px;
  }

  .player-info {
    grid-column: 1;
  }

  .player-name {
    font-size: 1.75rem;
  }

  .player-attributes {
    grid-column: 1;
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .action-buttons {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .btn {
    padding: 1.25rem 1.5rem;
  }

  .btn-primary {
    padding: 1.5rem 2rem;
  }
}

@media (max-width: 480px) {
  .result-wrapper {
    padding: 1rem;
    gap: 1rem;
  }

  .result-title {
    font-size: 2rem;
  }

  .result-icon {
    font-size: 3.5rem;
  }

  .result-subtitle {
    font-size: 1rem;
  }

  .player-card {
    padding: 1.25rem;
    gap: 1.25rem;
  }

  .photo-frame {
    width: 140px;
    height: 140px;
  }

  .player-name {
    font-size: 1.5rem;
  }

  .player-description {
    font-size: 0.875rem;
  }

  .attribute-item {
    padding: 1rem;
  }

  .attribute-icon {
    font-size: 1.5rem;
  }

  .attribute-value {
    font-size: 1rem;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .stat-icon {
    font-size: 1.75rem;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .btn {
    padding: 1rem 1.25rem;
    font-size: 0.875rem;
  }

  .btn-primary {
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
  }

  .btn-icon {
    font-size: 1.25rem;
  }
}

@media (max-height: 768px) and (min-width: 769px) {
  .result-wrapper {
    padding: 1rem 1.5rem;
    gap: 1rem;
    max-height: 100vh;
    overflow-y: auto;
  }

  .result-title {
    font-size: 2.5rem;
  }

  .result-icon {
    font-size: 4rem;
  }

  .result-header {
    margin-bottom: 0;
  }



  .player-card {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .photo-frame {
    width: 160px;
    height: 160px;
  }

  .player-name {
    font-size: 2rem;
  }

  .player-attributes {
    gap: 0.75rem;
  }

  .attribute-item {
    padding: 1rem;
  }

  .stats-grid {
    gap: 1rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .stat-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .stat-value {
    font-size: 2rem;
  }

  .action-buttons {
    gap: 0.75rem;
  }

  .btn {
    padding: 1.25rem 1.5rem;
  }

  .btn-primary {
    padding: 1.5rem 2rem;
  }
}

@media (min-width: 1400px) {

  .result-wrapper {
    max-width: 1600px;
    padding-left: 2.5rem;
    padding-right: 2.5rem;

    gap: 1.5rem;
  }

  .result-title {
    font-size: 4rem;
  }

  .result-icon {
    font-size: 3.5rem;
  }

  .player-card {
    padding: 2.5rem;
    gap: 2.5rem;
  }

  .photo-frame {
    width: 240px;
    height: 240px;
  }

  .player-name {
    font-size: 3rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .stat-card {
    padding: 2rem;
  }

  .stat-value {
    font-size: 2.5rem;
  }
}

/* Disable animations */
[data-animations="disabled"] * {
  animation: none !important;
  transition: none !important;
}

[data-animations="disabled"] .btn::before,
[data-animations="disabled"] .player-card::before,
[data-animations="disabled"] .stat-card::before,
[data-animations="disabled"] .photo-overlay {
  display: none !important;
}

/* =========================================================
   MOBILE RESPONSIVE FIX – RESULT SCREEN
   ========================================================= */
@media (max-width: 768px) {

  /* الشاشة كاملة Scroll طبيعي */
  .result-screen {
    position: fixed;
    inset: 0;
    overflow-y: auto;
    align-items: flex-start;
    justify-content: flex-start;
  }

  /* الكونتينر الرئيسي */
  .result-wrapper {
    padding: 1rem;
    max-height: none;
    height: auto;
    gap: 1rem;
  }

  /* ================= HEADER ================= */
  .result-header {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .result-icon {
    font-size: 3.2rem;
  }

  .result-title {
    font-size: 1.9rem;
    line-height: 1.1;
    letter-spacing: -1px;
  }

  .result-subtitle {
    font-size: 0.95rem;
    margin-top: 0.25rem;
  }

  /* ================= CONTENT ================= */
  .result-content {
    gap: 1rem;
  }

  /* ================= PLAYER CARD ================= */
  .player-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    padding: 1.25rem;
    gap: 1.25rem;
  }

  .player-photo-wrapper {
    grid-row: auto;
    justify-content: center;
  }

  .photo-frame {
    width: 140px;
    height: 140px;
  }

  .player-info {
    text-align: center;
    gap: 0.4rem;
  }

  .info-label {
    font-size: 0.7rem;
  }

  .player-name {
    font-size: 1.4rem;
    line-height: 1.2;
  }

  .player-description {
    font-size: 0.85rem;
    line-height: 1.4;
  }

  /* ================= ATTRIBUTES ================= */
  .player-attributes {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .attribute-item {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .attribute-icon {
    font-size: 1.4rem;
  }

  .attribute-label {
    font-size: 0.65rem;
  }

  .attribute-value {
    font-size: 0.95rem;
  }

  /* ================= STATS ================= */
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .stat-card {
    padding: 1rem;
    gap: 0.75rem;
  }

  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .stat-icon {
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 0.65rem;
  }

  .stat-value {
    font-size: 1.4rem;
  }

  /* ================= ACTION BUTTONS ================= */
  .action-buttons {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .btn {
    padding: 0.9rem 1rem;
    font-size: 0.9rem;
    border-radius: 14px;
  }

  .btn-primary {
    padding: 1rem;
    font-size: 1rem;
  }

  .btn-icon {
    font-size: 1.2rem;
  }

  /* ================= ANIMATIONS (SAFE) ================= */
  .result-wrapper.win,
  .result-wrapper.lose,
  .player-card,
  .stat-card {
    animation: none !important;
  }
}
</style>
