<template>
  <div class="profile-screen">
    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast-notification" :class="toast.type">
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="toast-content">
          <p class="toast-title">{{ toast.title }}</p>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button @click="hideToast" class="toast-close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </Transition>

    <!-- LEFT SIDE -->
    <div class="profile-visual-side">
      <div class="visual-bg"></div>

      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <button @click="goBack" class="back-nav-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>{{ $t('backToHome') }}</span>
      </button>

      <div class="profile-visual-content">

        <div class="profile-hero">

          <!-- Avatar with Upload - ALWAYS SHOW -->
          <div class="hero-avatar">
       <div
  class="avatar-circle"
  @click="triggerFileUpload"
  :class="{ uploading }"
>
  <!-- Avatar Image -->
  <img
    :src="avatarUrl || '/images/default.png'"
    alt="Profile"
    class="avatar-image"
  />

  <!-- Text over default image -->
  

  <!-- Upload Spinner -->
  <div v-if="uploading" class="upload-spinner">
    <div class="spinner"></div>
  </div>

  <!-- Hover Overlay -->
  <div v-else class="avatar-overlay">
    <svg
      class="camera-icon"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      />
      <circle cx="12" cy="13" r="4" />
    </svg>
    <span class="change-text">{{ $t('changePhoto') }}</span>
  </div>
</div>

            <div class="avatar-glow-ring"></div>
            <input 
              ref="fileInput" 
              type="file" 
              accept="image/*" 
              @change="handleFileUpload" 
              class="hidden-file-input"
            />
          </div>

          <!-- Name - ALWAYS SHOW -->
          <h1 class="hero-name gradient-text">{{ userData.name }}</h1>
          <p class="hero-email">{{ userData.email }}</p>

          <!-- Stats - Show shimmer when loading, stats when loaded, empty state when no games -->
          <div v-if="isLoading" class="stats-showcase">
            <div class="stat-showcase-item" v-for="i in 3" :key="`stat-shimmer-${i}`">
              <div class="shimmer-stat-icon"></div>
              <div class="shimmer-stat-number"></div>
              <div class="shimmer-stat-text"></div>
            </div>
          </div>

          <div v-else-if="gameHistory.length > 0" class="stats-showcase">
            <div class="stat-showcase-item">
              <div class="stat-icon">🎮</div>
              <div class="stat-number">{{ totalGames }}</div>
              <div class="stat-text">{{ $t('totalGames') }}</div>
            </div>

            <div class="stat-divider"></div>

            <div class="stat-showcase-item win">
              <div class="stat-icon">🏆</div>
              <div class="stat-number">{{ wins }}</div>
              <div class="stat-text">{{ $t('wins') }}</div>
            </div>

            <div class="stat-divider"></div>

            <div class="stat-showcase-item loss">
              <div class="stat-icon">❌</div>
              <div class="stat-number">{{ losses }}</div>
              <div class="stat-text">{{ $t('losses') }}</div>
            </div>
          </div>

          <!-- Empty State for No Games -->
          <div v-else class="empty-stats-box">
            <div class="empty-stats-icon">🎯</div>
            <p class="empty-stats-text">{{ $t('noGamesYet') }}</p>
            <button @click="goToThemes" class="start-first-game-btn">
              🚀 {{ $t('startYourFirstGame') }}
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- RIGHT SIDE -->
    <div class="profile-history-side">
      <div class="history-content">

        <div class="history-header">
          <h2 class="history-title gradient-text">{{ $t('gameHistory') }}</h2>
          <p class="history-subtitle">{{ $t('lastFiveGames') }}</p>
        </div>

        <!-- Loading Shimmer -->
        <div v-if="isLoading" class="history-list">
          <div v-for="i in 5" :key="`shimmer-${i}`" class="history-item shimmer">
            <div class="history-item-header">
              <div class="shimmer-badge"></div>
              <div class="shimmer-date"></div>
            </div>
            <div class="history-item-body">
              <div class="game-info-row">
                <div class="shimmer-label"></div>
                <div class="shimmer-value"></div>
              </div>
              <div class="game-info-grid">
                <div class="info-cell">
                  <div class="shimmer-cell-label"></div>
                  <div class="shimmer-cell-value"></div>
                </div>
                <div class="info-cell">
                  <div class="shimmer-cell-label"></div>
                  <div class="shimmer-cell-value"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="gameHistory.length === 0" class="empty-history-state">
          <div class="empty-history-illustration">🎮</div>
          <h3 class="empty-history-title">
            {{ $t('noHistoryTitle') }}
          </h3>
          <p class="empty-history-subtitle">
            {{ $t('noHistorySubtitle') }}
          </p>
        </div>

        <!-- Actual History -->
        <div v-else class="history-list">
          <div v-for="(game, index) in gameHistory" :key="game.id" class="history-item" :style="{ '--index': index }">
            <div class="history-item-header">
              <div class="result-badge" :class="game.result">
                <span class="result-icon">{{ game.result === 'won' ? '✓' : '✗' }}</span>
                <span class="result-text">{{ game.result === 'won' ? $t('won') : $t('lost') }}</span>
              </div>
              <span class="game-date">{{ formatDate(game.date) }}</span>
            </div>

            <div class="history-item-body">
              <div class="game-info-row">
                <span class="info-label">{{ $t('entity') }}</span>
                <span class="info-value entity-highlight">{{ game.entity }}</span>
              </div>

              <div class="game-info-grid">
                <div class="info-cell">
                  <span class="cell-label">{{ $t('theme') }}</span>
                  <span class="cell-value">{{ game.theme?.ar }}</span>
                </div>

                <div class="info-cell">
                  <span class="cell-label">{{ $t('difficulty') }}</span>
                  <span class="cell-value difficulty" :class="game.difficulty">
                    {{ game.difficulty?.ar }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '../stores/profile';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isLoading = ref(true);
const router = useRouter();
const profileStore = useProfileStore();
const fileInput = ref(null);
const uploading = ref(false);

// Toast notification state
const toast = ref({
  show: false,
  type: 'success', // 'success' or 'error'
  title: '',
  message: '',
});

const goToThemes = () => router.push('/home');

/* Load data on mount */
onMounted(async () => {
  isLoading.value = true;
  await profileStore.fetchProfile();
  profileStore.loadFromStorage();
  isLoading.value = false;
});

/* Profile Data (computed) */
const userData = computed(() => ({
  name: profileStore.profile?.name || 'Player',
  email: profileStore.profile?.email || 'player@example.com',
}));

const totalGames = computed(() => profileStore.totalGames);
const wins = computed(() => profileStore.wins);
const losses = computed(() => profileStore.losses);

/* History */
const gameHistory = computed(() => profileStore.history);

/* Avatar URL from store */
const avatarUrl = computed(() => profileStore.avatarUrl);

/* Avatar Initials */
const userInitials = computed(() => {
  const name = userData.value.name;
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

/* Toast Functions */
const showToast = (type: 'success' | 'error', title: string, message: string) => {
  toast.value = {
    show: true,
    type,
    title,
    message,
  };

  // Auto hide after 4 seconds
  setTimeout(() => {
    hideToast();
  }, 4000);
};

const hideToast = () => {
  toast.value.show = false;
};

/* Avatar Upload Functions */
const triggerFileUpload = () => {
  if (!uploading.value) {
    fileInput.value?.click();
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showToast('error', t('uploadErrorTitle'), t('uploadErrorInvalidType'));
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('error', t('uploadErrorTitle'), t('uploadErrorTooLarge'));
    return;
  }

  uploading.value = true;
  const success = await profileStore.updateAvatar(file);
  uploading.value = false;

  if (success) {
    showToast('success', t('uploadSuccessTitle'), t('uploadSuccessMessage'));
  } else {
    showToast('error', t('uploadErrorTitle'), t('uploadErrorMessage'));
  }

  // Clear input
  event.target.value = '';
};

/* Date formatter */
const formatDate = (input) => {
  const date = new Date(input);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const goBack = () => router.push('/home');
</script>


<style scoped>
.profile-screen {
  min-height: 100vh;
  display: flex;
  background: var(--bg-primary);
}

.profile-visual-side {
  flex: 1;
  min-width: 45%;
  position: relative;
  display: flex;
  /* align-items: center; */
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
  background: rgba(var(--card-bg-rgb, 26, 26, 36), 0.6);
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

.profile-visual-content {
  margin-top: 3rem;
  position: relative;
  z-index: 2;
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

.profile-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

.hero-avatar {
  position: relative;
  margin-bottom: 1rem;
}

.avatar-circle {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 10px 40px rgba(0, 212, 255, 0.4);
  animation: avatar-bounce 3s ease-in-out infinite;
}

@keyframes avatar-bounce {

  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-10px) scale(1.05);
  }
}

.avatar-initials {
  font-size: 3rem;
  font-weight: 700;
  color: white;
}

.avatar-glow-ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  opacity: 0.3;
  filter: blur(20px);
  animation: ring-pulse 2.5s ease-in-out infinite;
}

@keyframes ring-pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

.hero-name {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  margin: 0;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-email {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: -0.5rem 0 0 0;
}

.stats-showcase {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  padding: 2rem 3rem;
  background: rgba(var(--card-bg-rgb, 26, 26, 36), 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
}

.stat-showcase-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 2.5rem;
  animation: icon-float 3s ease-in-out infinite;
}

.stat-showcase-item:nth-child(1) .stat-icon {
  animation-delay: 0s;
}

.stat-showcase-item:nth-child(3) .stat-icon {
  animation-delay: 0.3s;
}

.stat-showcase-item:nth-child(5) .stat-icon {
  animation-delay: 0.6s;
}

@keyframes icon-float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, transparent, var(--border-color), transparent);
}

.profile-history-side {
  flex: 1;
  background: var(--bg-secondary);
  padding: 3rem;
  overflow-y: auto;
  border-right: 1px solid var(--border-color);
}

.history-content {
  max-width: 700px;
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

.history-header {
  margin-bottom: 2rem;
}

.history-title {
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.history-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  animation: history-slide-in 0.5s ease calc(var(--index) * 0.1s) both;
}

@keyframes history-slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.history-item:hover {
  transform: translateX(-4px);
  border-color: var(--accent-color);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.history-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
}

.result-badge.won {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05));
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.result-badge.lost {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.result-icon {
  font-size: 1.1rem;
}

.game-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.history-item-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.info-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.info-value {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 700;
}

.entity-highlight {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.1rem;
}

.game-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cell-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cell-value {
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 600;
}

.cell-value.difficulty {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  width: fit-content;
}

.cell-value.difficulty.سهل {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.cell-value.difficulty.متوسط {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.cell-value.difficulty.صعب {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

@media (max-width: 1024px) {
  .profile-screen {
    flex-direction: column;
  }

  .profile-visual-side,
  .profile-history-side {
    min-width: 100%;
    padding: 2rem 1.5rem;
  }

  .stats-showcase {
    gap: 1.5rem;
    padding: 1.5rem 2rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .profile-visual-side {
    padding: 1.5rem 1rem;
  }

  .back-nav-button {
    top: 1rem;
    left: 1rem;
    padding: 0.625rem 1rem;
  }

  .avatar-circle {
    width: 100px;
    height: 100px;
  }

  .avatar-initials {
    font-size: 2rem;
  }

  .stats-showcase {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .stat-divider {
    width: 60%;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border-color), transparent);
  }

  .profile-history-side {
    padding: 2rem 1rem;
  }

  .game-info-grid {
    grid-template-columns: 1fr;
  }
}

.empty-left-state {
  margin-top: 4rem;
  text-align: center;
  color: var(--text-primary);
  animation: fade-in 0.8s ease-out;
}

.empty-left-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: float-icon 3s ease-in-out infinite;
  opacity: 0.9;
}

.empty-left-state h2 {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.empty-left-text {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.start-game-btn {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  padding: 0.9rem 2rem;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  border: none;
  transition: 0.25s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.start-game-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
}

@keyframes float-icon {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-history-state {
  text-align: center;
  padding: 4rem 2rem;
  border: 1px dashed var(--border-color);
  border-radius: 16px;
  background: rgba(var(--card-bg-rgb, 26, 26, 36), 0.4);
  backdrop-filter: blur(10px);
  margin-top: 2rem;
  animation: fadeIn 0.6s ease;
}

.empty-history-illustration {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.empty-history-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.empty-history-subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.empty-history-btn {
  background: var(--accent-color);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
  border: none;
}

.empty-history-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Shimmer Animation */
.shimmer {
  position: relative;
  overflow: hidden;
  background: var(--card-bg) !important;
}

.shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  animation: shimmer-slide 1.5s infinite;
}

@keyframes shimmer-slide {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Shimmer Elements */
.shimmer-badge {
  width: 100px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50px;
  animation: shimmer-pulse 1.5s ease-in-out infinite;
}

.shimmer-date {
  width: 80px;
  height: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  animation: shimmer-pulse 1.5s ease-in-out infinite 0.2s;
}

.shimmer-label {
  width: 80px;
  height: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  animation: shimmer-pulse 1.5s ease-in-out infinite 0.3s;
}

.shimmer-value {
  width: 120px;
  height: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  animation: shimmer-pulse 1.5s ease-in-out infinite 0.4s;
}

.shimmer-cell-label {
  width: 60px;
  height: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  animation: shimmer-pulse 1.5s ease-in-out infinite 0.5s;
}

.shimmer-cell-value {
  width: 90px;
  height: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  animation: shimmer-pulse 1.5s ease-in-out infinite 0.6s;
}

@keyframes shimmer-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Remove hover effect on shimmer */
.shimmer:hover {
  transform: none;
  border-color: var(--border-color);
  box-shadow: none;
}

.shimmer-stat-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: shimmer-pulse 1.5s ease-in-out infinite;
}

.shimmer-stat-number {
  width: 60px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-top: 0.5rem;
  animation: shimmer-pulse 1.5s ease-in-out infinite 0.2s;
}

.shimmer-stat-text {
  width: 80px;
  height: 14px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-top: 0.5rem;
  animation: shimmer-pulse 1.5s ease-in-out infinite 0.4s;
}

/* Avatar Upload Styles - ADD THESE */
.avatar-circle {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 10px 40px rgba(0, 212, 255, 0.4);
  animation: avatar-bounce 3s ease-in-out infinite;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.avatar-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 50px rgba(0, 212, 255, 0.5);
}

.avatar-circle:hover .avatar-overlay {
  opacity: 1;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.camera-icon {
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.change-text {
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hidden-file-input {
  display: none;
}

/* REPLACE the existing @media (max-width: 768px) with this: */
@media (max-width: 768px) {
  .profile-visual-side {
    padding: 1.5rem 1rem;
  }

  .back-nav-button {
    top: 1rem;
    left: 1rem;
    padding: 0.625rem 1rem;
    font-size: 0.85rem;
  }

  .back-nav-button svg {
    width: 16px;
    height: 16px;
  }

  .profile-visual-content {
    margin-top: 1.5rem;
  }

  .avatar-circle {
    width: 110px;
    height: 110px;
  }

  .avatar-initials {
    font-size: 2.2rem;
  }

  .hero-name {
    font-size: 1.8rem;
  }

  .hero-email {
    font-size: 0.9rem;
  }

  .stats-showcase {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    width: 100%;
  }

  .stat-showcase-item {
    width: 100%;
  }

  .stat-divider {
    width: 80%;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border-color), transparent);
  }

  .stat-icon {
    font-size: 2.2rem;
  }

  .stat-number {
    font-size: 2.2rem;
  }

  .stat-text {
    font-size: 0.8rem;
  }

  .profile-history-side {
    padding: 2rem 1rem;
  }

  .history-title {
    font-size: 1.6rem;
  }

  .history-subtitle {
    font-size: 0.9rem;
  }

  .history-item {
    padding: 1.25rem;
  }

  .result-badge {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .game-date {
    font-size: 0.8rem;
  }

  .info-value {
    font-size: 0.95rem;
  }

  .entity-highlight {
    font-size: 1rem;
  }

  .game-info-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .empty-left-state {
    margin-top: 2rem;
    padding: 0 1rem;
  }

  .empty-left-icon {
    font-size: 4rem;
  }

  .empty-left-state h2 {
    font-size: 1.6rem;
  }

  .empty-left-text {
    font-size: 0.95rem;
  }

  .start-game-btn {
    padding: 0.8rem 1.75rem;
    font-size: 1rem;
  }

  .empty-history-state {
    padding: 3rem 1.5rem;
  }

  .empty-history-illustration {
    font-size: 3.5rem;
  }

  .empty-history-title {
    font-size: 1.3rem;
  }

  .empty-history-subtitle {
    font-size: 0.9rem;
  }
}

/* ADD this new media query for extra small screens: */
@media (max-width: 480px) {
  .profile-visual-side {
    padding: 1rem 0.75rem;
  }

  .back-nav-button {
    padding: 0.5rem 0.875rem;
    font-size: 0.8rem;
  }

  .avatar-circle {
    width: 95px;
    height: 95px;
  }

  .avatar-initials {
    font-size: 1.8rem;
  }

  .camera-icon {
    width: 24px;
    height: 24px;
  }

  .change-text {
    font-size: 0.65rem;
  }

  .hero-name {
    font-size: 1.5rem;
  }

  .hero-email {
    font-size: 0.85rem;
  }

  .stats-showcase {
    padding: 1.25rem;
    gap: 1.25rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-text {
    font-size: 0.75rem;
  }

  .profile-history-side {
    padding: 1.5rem 0.75rem;
  }

  .history-title {
    font-size: 1.4rem;
  }

  .history-subtitle {
    font-size: 0.85rem;
  }

  .history-item {
    padding: 1rem;
  }

  .result-badge {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
  }

  .result-icon {
    font-size: 1rem;
  }

  .game-date {
    font-size: 0.75rem;
  }

  .info-label,
  .info-value {
    font-size: 0.85rem;
  }

  .entity-highlight {
    font-size: 0.9rem;
  }

  .cell-label {
    font-size: 0.75rem;
  }

  .cell-value {
    font-size: 0.85rem;
  }

  .empty-left-icon {
    font-size: 3.5rem;
  }

  .empty-left-state h2 {
    font-size: 1.4rem;
  }

  .start-game-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }

  .empty-history-state {
    padding: 2.5rem 1rem;
  }

  .empty-history-illustration {
    font-size: 3rem;
  }

  .empty-history-title {
    font-size: 1.2rem;
  }

  .empty-history-subtitle {
    font-size: 0.85rem;
  }
}
/* Empty Stats Box - When no games played yet */
.empty-stats-box {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(var(--card-bg-rgb, 26, 26, 36), 0.6);
  backdrop-filter: blur(20px);
  border: 1px dashed var(--border-color);
  border-radius: 24px;
  text-align: center;
  animation: fade-in 0.6s ease;
}

.empty-stats-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: float-icon 3s ease-in-out infinite;
  opacity: 0.8;
}

.empty-stats-text {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.start-first-game-btn {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  padding: 0.75rem 1.75rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  border: none;
  transition: 0.25s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.start-first-game-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
}

/* Responsive for empty stats */
@media (max-width: 768px) {
  .empty-stats-box {
    padding: 1.5rem;
  }

  .empty-stats-icon {
    font-size: 2.5rem;
  }

  .empty-stats-text {
    font-size: 0.95rem;
  }

  .start-first-game-btn {
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .empty-stats-box {
    padding: 1.25rem;
  }

  .empty-stats-icon {
    font-size: 2.2rem;
  }

  .empty-stats-text {
    font-size: 0.9rem;
  }

  .start-first-game-btn {
    padding: 0.65rem 1.3rem;
    font-size: 0.9rem;
  }
}
</style>

<style scoped>
/* Toast Notification Styles */
.toast-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  min-width: 320px;
  max-width: 400px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  backdrop-filter: blur(20px);
}

.toast-notification.success {
  border-color: rgba(34, 197, 94, 0.5);
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
}

.toast-notification.error {
  border-color: rgba(239, 68, 68, 0.5);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
}

.toast-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-notification.success .toast-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.toast-notification.error .toast-icon {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.toast-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

/* Toast Transitions */
.toast-enter-active {
  animation: toast-slide-in 0.3s ease-out;
}

.toast-leave-active {
  animation: toast-slide-out 0.3s ease-in;
}

@keyframes toast-slide-in {
  from {
    transform: translateX(100%) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }
}

@keyframes toast-slide-out {
  from {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%) translateY(-20px);
    opacity: 0;
  }
}

/* Upload Spinner */
.upload-spinner {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.avatar-circle.uploading {
  pointer-events: none;
  cursor: not-allowed;
}

/* Mobile Toast Responsive */
@media (max-width: 768px) {
  .toast-notification {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    max-width: none;
    padding: 1rem;
  }

  .toast-icon {
    width: 36px;
    height: 36px;
  }

  .toast-title {
    font-size: 0.95rem;
  }

  .toast-message {
    font-size: 0.825rem;
  }
}

@media (max-width: 480px) {
  .toast-notification {
    padding: 0.875rem;
  }

  .toast-icon {
    width: 32px;
    height: 32px;
  }

  .toast-icon svg {
    width: 20px;
    height: 20px;
  }

  .toast-title {
    font-size: 0.9rem;
  }

  .toast-message {
    font-size: 0.8rem;
  }
}
.avatar-circle {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background: #00a8e8; /* secondary color */
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.05) brightness(0.98);
}

/* Default avatar text (واضح بدون تغبيش) */
.default-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.25); /* طبقة خفيفة فوق اللون */
  text-align: center;
  pointer-events: none;
}

/* Hover overlay */
.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.avatar-circle:hover .avatar-overlay {
  opacity: 1;
}

/* Spinner overlay */
.upload-spinner {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

</style>