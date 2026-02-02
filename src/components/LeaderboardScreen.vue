<template>
  <div class="leaderboard-screen">
    <!-- LEFT SIDE - Visual Hero -->
    <div class="leaderboard-visual-side">
      <div class="visual-bg"></div>

      <!-- Floating Shapes -->
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <!-- Back Button -->
      <button @click="goBack" class="back-nav-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>{{ $t('backToHome') }}</span>
      </button>

      <!-- Hero Content -->
      <div class="leaderboard-hero">
        <!-- Trophy Icon -->
        <div class="hero-trophy-container">
          <div class="trophy-glow"></div>
          <div class="trophy-icon">🏆</div>
          <div class="trophy-sparkles">
            <div class="sparkle sparkle-1">✨</div>
            <div class="sparkle sparkle-2">✨</div>
            <div class="sparkle sparkle-3">✨</div>
          </div>
        </div>

        <!-- Title -->
        <h1 class="hero-title gradient-text">{{ $t('leaderboard') }}</h1>
        <p class="hero-subtitle">{{ $t('leaderboardSubtitle') }}</p>

        <!-- Top 3 Podium -->
        <div v-if="topPlayers.length >= 3" class="podium-container">
          <!-- 2nd Place -->
          <div class="podium-player rank-2" :style="{ '--delay': '0.2s' }">
            <div class="podium-rank-badge silver">
              <span class="rank-number">2</span>
            </div>
            <div class="podium-avatar silver-glow">
              <span class="avatar-initials">{{ topPlayers[1]?.initials }}</span>
            </div>
            <div class="podium-info">
              <h3 class="podium-name">{{ topPlayers[1]?.name }}</h3>
              <div class="podium-score">
                <span class="score-icon">⭐</span>
                <span class="score-value">{{ topPlayers[1]?.score }}</span>
              </div>
            </div>
            <div class="podium-stand stand-2">
              <div class="stand-label">2nd</div>
            </div>
          </div>

          <!-- 1st Place -->
          <div class="podium-player rank-1" :style="{ '--delay': '0s' }">
            <div class="crown-icon">👑</div>
            <div class="podium-rank-badge gold">
              <span class="rank-number">1</span>
            </div>
            <div class="podium-avatar gold-glow">
              <span class="avatar-initials">{{ topPlayers[0]?.initials }}</span>
            </div>
            <div class="podium-info">
              <h3 class="podium-name">{{ topPlayers[0]?.name }}</h3>
              <div class="podium-score">
                <span class="score-icon">⭐</span>
                <span class="score-value">{{ topPlayers[0]?.score }}</span>
              </div>
            </div>
            <div class="podium-stand stand-1">
              <div class="stand-label">1st</div>
            </div>
          </div>

          <!-- 3rd Place -->
          <div class="podium-player rank-3" :style="{ '--delay': '0.4s' }">
            <div class="podium-rank-badge bronze">
              <span class="rank-number">3</span>
            </div>
            <div class="podium-avatar bronze-glow">
              <span class="avatar-initials">{{ topPlayers[2]?.initials }}</span>
            </div>
            <div class="podium-info">
              <h3 class="podium-name">{{ topPlayers[2]?.name }}</h3>
              <div class="podium-score">
                <span class="score-icon">⭐</span>
                <span class="score-value">{{ topPlayers[2]?.score }}</span>
              </div>
            </div>
            <div class="podium-stand stand-3">
              <div class="stand-label">3rd</div>
            </div>
          </div>
        </div>
        <div v-else class="empty-podium">
  <div class="empty-icon">🎯</div>
  <h3 class="empty-title">{{ $t('noPodiumYet') }}</h3>
  <p class="empty-subtitle">{{ $t('noPodiumDescription') }}</p>
</div>
      </div>
    </div>

    <!-- RIGHT SIDE - Rankings 4-10 -->
    <div class="leaderboard-list-side">
      <div class="list-content">
        <!-- Header -->
        <div class="list-header">
          <h2 class="list-title gradient-text">{{ $t('topRanking') }}</h2>
          <p class="list-subtitle">{{ $t('topRankingSubTitle') }}</p>
        </div>

        <!-- Rankings List -->
        <div v-if="allPlayers.length > 0" class="rankings-list">
          <div v-for="(player, index) in allPlayers" :key="player.rank" class="ranking-item"
            :style="{ '--index': index }">
            <!-- Rank Badge -->
            <div class="rank-badge" :class="getRankClass(player.rank)">
              <span class="rank-number">#{{ player.rank }}</span>
            </div>

            <div class="player-content">
              <!-- Enhanced Avatar Section -->
              <div class="avatar-wrapper">
                <!-- Animated Glow Ring -->
             

                <!-- Rotating Border -->
                <div class="avatar-border-rotating"></div>

                <!-- Avatar Container -->
             <div class="avatar-container">
  <responsive-image
    v-if="player.avatar"
    :src="player.avatar"
    :alt="player.name"
    fit="cover"
    :quality="90"
  />
  <div v-else class="player-avatar-initials">
    {{ player.initials }}
  </div>
</div>

                <!-- Rank Position Badge on Avatar -->
                <div class="avatar-rank-badge" :class="getRankClass(player.rank)">
                  {{ getRankEmoji(player.rank) }}
                </div>

                <!-- Online Status Indicator -->
                <div class="online-status"></div>
              </div>

              <!-- Player Info -->
              <div class="player-info">
                <h3 class="player-name">{{ player.name }}</h3>
                <div class="player-stats-mini">
                  <span class="stat-mini">
                    <span class="stat-icon">🎮</span>
                    {{ player.gamesPlayed }} {{ $t('round') }}
                  </span>
                  <span class="stat-divider-mini">•</span>
                  <span class="stat-mini">
                    <span class="stat-icon">🏆</span>
                    {{ player.wins }} {{ $t('wins') }}
                  </span>
                </div>
              </div>




              <!-- Additional Stats -->
              <div class="player-stats-grid">
                <div class="player-score">
                  <div class="score-label">{{ $t('score') }}</div>
                  <div class="score-value-large">{{ player.score }}</div>
                </div>
                <div class="stat-cell">
                  <span class="stat-cell-label">{{ $t('winRate') }}</span>
                  <span class="stat-cell-value">{{ player.winRate }}%</span>
                </div>
                <div class="stat-cell">
                  <span class="stat-cell-label">{{ $t('avgTime') }}</span>
                  <span class="stat-cell-value">{{ player.avgTime }}s</span>
                </div>
              </div>
            </div>

            <!-- Hover Glow Effect -->
            <div class="item-glow"></div>
          </div>
        </div>
        <div v-else class="empty-rankings">
  <div class="empty-animation">
    <div class="empty-trophy">🏆</div>
    <div class="empty-sparkle">✨</div>
  </div>
  <h3 class="empty-rankings-title">{{ $t('noRankingsYet') }}</h3>
  <p class="empty-rankings-text">{{ $t('noRankingsDescription') }}</p>
 <button @click="goToHome" class="empty-hint">
  <span class="hint-icon">💡</span>
  <span>{{ $t('startPlayingHint') }}</span>
</button>
</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '../stores/theme';
import { storeToRefs } from 'pinia';
import { useLeaderboardStore } from '../stores/leaderboard';
import ResponsiveImage from './ResponsiveImage.vue';
// Mock leaderboard data
const router = useRouter();
const themeStore = useThemeStore();
const { playSound } = themeStore;
const leaderboardStore = useLeaderboardStore();
const { topPlayers, allPlayers } = storeToRefs(leaderboardStore);
const isEmpty = computed(() => {
  return !allPlayers.value || allPlayers.value.length === 0;
});

onMounted(() => {
  leaderboardStore.fetchLeaderboard();
});

const  goToHome = () => {
    router.push({ name: 'home' });
  }
const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-gold';
  if (rank === 2) return 'rank-silver';
  if (rank === 3) return 'rank-bronze';
  return 'rank-default';
}
const getRankEmoji = (rank: number) => {
  if (rank === 1) return '👑';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}
const goBack = () => {
  playSound('click');
  router.push({ name: 'home' });
};
</script>

<style scoped>
.leaderboard-screen {
  min-height: 100vh;
  display: flex;
  background: var(--bg-primary);
}

/* ========== LEFT SIDE - VISUAL HERO ========== */
.leaderboard-visual-side {
  flex: 1;
  min-width: 45%;
  position: relative;

  align-items: center;
  justify-content: center;
  padding: 3rem;
  overflow: hidden;
}

.visual-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
      var(--bg-primary) 0%,
      var(--bg-secondary) 50%,
      var(--bg-primary) 100%);
  opacity: 0.9;
}

.visual-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 80%;
  height: 150%;
  background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
  opacity: 0.15;
  border-radius: 50%;
  animation: float-orbit 20s ease-in-out infinite;
}

.visual-bg::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -15%;
  width: 70%;
  height: 120%;
  background: radial-gradient(circle, var(--secondary-color) 0%, transparent 70%);
  opacity: 0.12;
  border-radius: 50%;
  animation: float-orbit 25s ease-in-out infinite reverse;
}

@keyframes float-orbit {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -30px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.floating-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  opacity: 0.08;
  filter: blur(40px);
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: 10%;
  right: 15%;
  animation: morph-shape 15s ease-in-out infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  bottom: 20%;
  left: 10%;
  animation: morph-shape 20s ease-in-out infinite reverse;
}

.shape-3 {
  width: 250px;
  height: 250px;
  top: 50%;
  left: 40%;
  animation: morph-shape 18s ease-in-out infinite;
}

@keyframes morph-shape {

  0%,
  100% {
    border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
    transform: rotate(0deg);
  }

  25% {
    border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%;
    transform: rotate(90deg);
  }

  50% {
    border-radius: 60% 40% 40% 60% / 40% 60% 40% 60%;
    transform: rotate(180deg);
  }

  75% {
    border-radius: 45% 55% 55% 45% / 55% 45% 55% 45%;
    transform: rotate(270deg);
  }
}

.back-nav-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(26, 26, 36, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.back-nav-button:hover {
  transform: translateX(-4px);
  background: var(--card-bg);
  border-color: var(--accent-color);
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2);
}

/* Hero Content */
.leaderboard-hero {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: fade-slide-in 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fade-slide-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Trophy Hero */
.hero-trophy-container {
  position: relative;
  margin-bottom: 1rem;
}

.trophy-glow {
  position: absolute;
  inset: -30px;
  background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
  opacity: 0.4;
  filter: blur(40px);
  animation: trophy-pulse 3s ease-in-out infinite;
}

@keyframes trophy-pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.4;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

.trophy-icon {
  font-size: 6rem;
  position: relative;
  z-index: 2;
  animation: trophy-bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 10px 30px rgba(0, 212, 255, 0.5));
}

@keyframes trophy-bounce {

  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }

  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.trophy-sparkles {
  position: absolute;
  inset: 0;
}

.sparkle {
  position: absolute;
  font-size: 1.5rem;
  animation: sparkle-float 3s ease-in-out infinite;
}

.sparkle-1 {
  top: 0;
  left: -20px;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 20px;
  right: -10px;
  animation-delay: 1s;
}

.sparkle-3 {
  bottom: 10px;
  left: -10px;
  animation-delay: 2s;
}

@keyframes sparkle-float {

  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }

  50% {
    transform: translateY(-30px) scale(1.2);
    opacity: 1;
  }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: -1px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: -1rem 0 0 0;
}

/* ========== PODIUM ========== */
.podium-container {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  margin-top: 2rem;
}

.podium-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
  animation: podium-rise 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) var(--delay) both;
}

@keyframes podium-rise {
  from {
    opacity: 0;
    transform: translateY(100px) scale(0.8);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.crown-icon {
  font-size: 2.5rem;
  position: absolute;
  top: -3rem;
  animation: crown-float 2s ease-in-out infinite;
}

@keyframes crown-float {

  0%,
  100% {
    transform: translateY(0) rotate(-10deg);
  }

  50% {
    transform: translateY(-10px) rotate(10deg);
  }
}

.podium-rank-badge {
  position: absolute;
  top: -10px;
  right: -5px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  z-index: 3;
  border: 3px solid var(--bg-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.podium-rank-badge.gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #8b6914;
}

.podium-rank-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #4a4a4a;
}

.podium-rank-badge.bronze {
  background: linear-gradient(135deg, #cd7f32, #e8a87c);
  color: #5c3d1f;
}

.podium-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  border: 4px solid transparent;
  transition: all 0.3s ease;
}

.rank-1 .podium-avatar {
  width: 120px;
  height: 120px;
}

.gold-glow {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
  border-color: #ffd700;
}

.silver-glow {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  box-shadow: 0 0 30px rgba(192, 192, 192, 0.5);
  border-color: #c0c0c0;
}

.bronze-glow {
  background: linear-gradient(135deg, #cd7f32, #e8a87c);
  box-shadow: 0 0 30px rgba(205, 127, 50, 0.5);
  border-color: #cd7f32;
}

.avatar-initials {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.rank-1 .avatar-initials {
  font-size: 2.5rem;
}

.podium-info {
  text-align: center;
}

.podium-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.rank-1 .podium-name {
  font-size: 1.3rem;
}

.podium-score {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rank-1 .podium-score {
  font-size: 1.4rem;
}

.score-icon {
  font-size: 1rem;
}

/* Podium Stands */
.podium-stand {
  width: 100px;
  background: rgba(var(--card-bg-rgb, 26, 26, 36), 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.5rem;
  position: relative;
  overflow: hidden;
}

.stand-1 {
  height: 140px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 237, 78, 0.05));
  border-color: rgba(255, 215, 0, 0.3);
  width: 120px;
}

.stand-2 {
  height: 110px;
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(232, 232, 232, 0.05));
  border-color: rgba(192, 192, 192, 0.3);
}

.stand-3 {
  height: 85px;
  background: linear-gradient(135deg, rgba(205, 127, 50, 0.15), rgba(232, 168, 124, 0.05));
  border-color: rgba(205, 127, 50, 0.3);
}

.stand-label {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ========== RIGHT SIDE - RANKINGS LIST ========== */
.leaderboard-list-side {
  flex: 1;
  background: var(--bg-secondary);
  padding: 3rem;
  overflow-y: auto;
  border-left: 1px solid var(--border-color);
}

.list-content {
  max-width: 800px;
  margin: 0 auto;
  animation: fade-slide-right 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes fade-slide-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.list-header {
  margin-bottom: 2rem;
}

.list-title {
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.list-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Rankings List */
.rankings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ranking-item {
  position: relative;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: ranking-slide-in 0.6s ease calc(var(--index) * 0.1s) both;
}

@keyframes ranking-slide-in {
  from {
    opacity: 0;
    transform: translateX(50px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.ranking-item:hover {
  transform: translateX(-8px) scale(1.01);
  border-color: var(--accent-color);
  box-shadow: 0 10px 40px rgba(0, 212, 255, 0.3);
}

.item-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.ranking-item:hover .item-glow {
  opacity: 1;
}

/* Rank Badge */
.rank-badge {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--card-bg-rgb, 26, 26, 36), 0.8);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 800;
  transition: all 0.3s ease;
}

.ranking-item:hover .rank-badge {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  border-color: var(--accent-color);
  transform: rotate(-10deg) scale(1.1);
}

.rank-number {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ranking-item:hover .rank-number {
  -webkit-text-fill-color: white;
}

/* Player Avatar */
.player-avatar {
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
  transition: all 0.3s ease;
}

.ranking-item:hover .player-avatar {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(0, 212, 255, 0.5);
}

.rank-position {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  background: var(--bg-primary);
  border: 2px solid var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--accent-color);
}

/* Player Info */
.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.player-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-stats-mini {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 0.9rem;
}

.stat-divider-mini {
  color: var(--border-color);
}

/* Player Score */
.player-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem;
  background: rgba(var(--card-bg-rgb, 26, 26, 36), 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.ranking-item:hover .player-score {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(138, 43, 226, 0.05));
  border-color: var(--accent-color);
}

.score-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  font-weight: 600;
}

.score-value-large {
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

/* Player Stats Grid */
.player-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  grid-column: 2 / -1;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.stat-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background: rgba(var(--card-bg-rgb, 26, 26, 36), 0.4);
  border-radius: 10px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.ranking-item:hover .stat-cell {
  background: rgba(0, 212, 255, 0.05);
  border-color: rgba(0, 212, 255, 0.2);
}

.stat-cell-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  font-weight: 600;
}

.stat-cell-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .leaderboard-screen {
    flex-direction: column;
  }

  .leaderboard-visual-side,
  .leaderboard-list-side {
    min-width: 100%;
    padding: 2rem 1.5rem;
  }

  .podium-container {
    gap: 1rem;
  }

  .podium-avatar {
    width: 80px;
    height: 80px;
  }

  .rank-1 .podium-avatar {
    width: 100px;
    height: 100px;
  }

  .podium-stand {
    width: 80px;
  }

  .stand-1 {
    width: 100px;
    height: 120px;
  }

  .stand-2 {
    height: 95px;
  }

  .stand-3 {
    height: 70px;
  }
}

@media (max-width: 768px) {
  .leaderboard-visual-side {
    padding: 1.5rem 1rem;
  }

  .back-nav-button {
    top: 1rem;
    left: 1rem;
    padding: 0.625rem 1rem;
  }

  .trophy-icon {
    font-size: 4rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .podium-container {
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .podium-avatar {
    width: 60px;
    height: 60px;
  }

  .rank-1 .podium-avatar {
    width: 80px;
    height: 80px;
  }

  .avatar-initials {
    font-size: 1.5rem;
  }

  .rank-1 .avatar-initials {
    font-size: 2rem;
  }

  .podium-name {
    font-size: 0.9rem;
  }

  .rank-1 .podium-name {
    font-size: 1.1rem;
  }

  .podium-score {
    font-size: 1rem;
  }

  .rank-1 .podium-score {
    font-size: 1.2rem;
  }

  .podium-stand {
    width: 60px;
  }

  .stand-1 {
    width: 80px;
    height: 100px;
  }

  .stand-2 {
    height: 80px;
  }

  .stand-3 {
    height: 60px;
  }

  .crown-icon {
    font-size: 1.8rem;
    top: -2.5rem;
  }

  .leaderboard-list-side {
    padding: 2rem 1rem;
  }

  .ranking-item {
    grid-template-columns: auto 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .player-avatar {
    width: 50px;
    height: 50px;
  }

  .rank-badge {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .player-name {
    font-size: 1rem;
  }

  .player-stats-mini {
    font-size: 0.75rem;
  }

  .player-score {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.75rem;
  }

  .score-value-large {
    font-size: 1.5rem;
  }

  .player-stats-grid {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .trophy-icon {
    font-size: 3.5rem;
  }

  .podium-container {
    gap: 0.5rem;
  }

  .podium-avatar {
    width: 50px;
    height: 50px;
  }

  .rank-1 .podium-avatar {
    width: 65px;
    height: 65px;
  }

  .avatar-initials {
    font-size: 1.2rem;
  }

  .rank-1 .avatar-initials {
    font-size: 1.6rem;
  }

  .podium-name {
    font-size: 0.8rem;
  }

  .rank-1 .podium-name {
    font-size: 1rem;
  }

  .podium-score {
    font-size: 0.9rem;
  }

  .rank-1 .podium-score {
    font-size: 1.1rem;
  }

  .podium-stand {
    width: 50px;
  }

  .stand-1 {
    width: 65px;
    height: 80px;
  }

  .stand-2 {
    height: 65px;
  }

  .stand-3 {
    height: 50px;
  }

  .stand-label {
    font-size: 1.2rem;
  }

  .ranking-item {
    padding: 0.875rem;
  }

  .player-avatar {
    width: 45px;
    height: 45px;
  }

  .rank-badge {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }

  .player-name {
    font-size: 0.95rem;
  }

  .score-value-large {
    font-size: 1.3rem;
  }
}
</style>

<style scoped>
.rankings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.ranking-item {
  position: relative;
  background: linear-gradient(135deg, rgba(100, 100, 150, 0.1), rgba(80, 80, 120, 0.05));
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 0.5s ease-out calc(var(--index) * 0.1s) both;
}

.ranking-item:hover {
  transform: scale(1.02);
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow: 0 20px 60px rgba(168, 85, 247, 0.2);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(50px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.rank-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.3rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
}

.rank-bronze {
  background: linear-gradient(135deg, #cd7f32, #ff9955);
}

.rank-default {
  background: linear-gradient(135deg, #a855f7, #7c3aed);
}

.player-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Enhanced Avatar Styles */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #ec4899, #a855f7);
  opacity: 0;
  filter: blur(20px);
  transition: opacity 0.5s;
  animation: pulse 2s ease-in-out infinite;
}

.ranking-item:hover .avatar-glow {
  opacity: 1;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}

.avatar-border-rotating {
  position: absolute;
  inset: 0;
  border-radius: 50%;

  opacity: 0.75;
  transition: opacity 0.3s;
  animation: rotate 3s linear infinite;
}

.ranking-item:hover .avatar-border-rotating {
  opacity: 1;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.avatar-container {
  width: 64px;        /* غيّر الحجم براحتك */
  height: 64px;
  border-radius: 50%;
  overflow: hidden;   /* أهم سطر */
  background: #1f2937; /* fallback */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* تأكد إن الصورة تملأ الدائرة */
.avatar-container img,
.avatar-container picture,
.avatar-container .responsive-image,
.avatar-container .responsive-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;  /* يملأ الدائرة بدون تشويه */
  display: block;
}

.player-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #475569;
  transition: border-color 0.3s;
}

.ranking-item:hover .player-avatar-img {
  border-color: #a855f7;
}

.player-avatar-initials {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  border: 2px solid #475569;
  transition: border-color 0.3s;
}

.ranking-item:hover .player-avatar-initials {
  border-color: #a855f7;
}

.avatar-rank-badge {
  position: absolute;
  bottom: -0.25rem;
  right: -0.25rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.online-status {
  position: absolute;
  top: 0;
  right: 0;
  width: 1rem;
  height: 1rem;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid #1e293b;
  animation: pulse 2s ease-in-out infinite;
  z-index: 2;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
}

.ranking-item:hover .player-name {
  color: #c084fc;
}

.player-stats-mini {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 1rem;
}

.stat-divider-mini {
  opacity: 0.5;
}

.player-score {
  text-align: center;
  padding: 0 1rem;
}

.score-label {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.score-value-large {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #c084fc, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.player-stats-grid {
  display: flex;
  gap: 1rem;
}

.stat-cell {
  text-align: center;
  background: rgba(51, 65, 85, 0.3);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  min-width: 5rem;
}

.stat-cell-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.stat-cell-value {
  display: block;
  font-size: 1.125rem;
  font-weight: bold;
  color: #10b981;
}

.stat-cell:last-child .stat-cell-value {
  color: #3b82f6;
}

.item-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
      rgba(168, 85, 247, 0) 0%,
      rgba(168, 85, 247, 0.05) 50%,
      rgba(236, 72, 153, 0) 100%);
  border-radius: 1rem;
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.ranking-item:hover .item-glow {
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .player-content {
    flex-wrap: wrap;
  }

  .player-stats-grid {
    width: 100%;
    justify-content: space-around;
  }
}

/* Empty States */
.empty-podium {
  text-align: center;
  padding: 3rem 2rem;
  margin-top: 2rem;
  animation: fade-in 0.8s ease;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: bounce-slow 3s ease-in-out infinite;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.empty-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
}

.empty-rankings {
  text-align: center;
  padding: 4rem 2rem;
  animation: fade-in 0.8s ease;
}

.empty-animation {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
}

.empty-trophy {
  font-size: 4rem;
  animation: trophy-float 3s ease-in-out infinite;
}

@keyframes trophy-float {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

.empty-sparkle {
  position: absolute;
  font-size: 1.5rem;
  top: 0;
  right: 0;
  animation: sparkle-spin 4s linear infinite;
}

@keyframes sparkle-spin {
  0% {
    transform: rotate(0deg) scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: rotate(180deg) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: rotate(360deg) scale(0.8);
    opacity: 0.5;
  }
}

.empty-rankings-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.75rem 0;
}

.empty-rankings-text {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
}
.empty-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: rgba(var(--card-bg-rgb, 26, 26, 36), 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
}

.empty-hint:hover {
  transform: translateY(-2px);
  border-color: var(--accent-color);
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2);
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(138, 43, 226, 0.05));
}

.empty-hint:active {
  transform: translateY(0);
}

.hint-icon {
  font-size: 1.2rem;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .empty-podium {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3.5rem;
  }
  
  .empty-title {
    font-size: 1.5rem;
  }
  
  .empty-rankings {
    padding: 3rem 1.5rem;
  }
  
  .empty-rankings-title {
    font-size: 1.6rem;
  }
  
  .empty-rankings-text {
    font-size: 1rem;
  }
}
</style>