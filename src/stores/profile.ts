import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../lib/api';

export const useProfileStore = defineStore('profile', () => {
  /* =====================================================
     STATE
  ===================================================== */
  const profile = ref<any | null>(null);
  const history = ref<any[]>([]);
  const loading = ref(false);

  /* =====================================================
     COMPUTED
  ===================================================== */
  const totalGames = computed(() => history.value.length);
  const wins = computed(() => history.value.filter(h => h.result === 'won').length);
  const losses = computed(() => history.value.filter(h => h.result === 'lost').length);

  const winRate = computed(() => {
    if (totalGames.value === 0) return 0;
    return Math.round((wins.value / totalGames.value) * 100);
  });

  const avatarUrl = computed(() => profile.value?.avatar || '');

  /* =====================================================
     LOAD PROFILE FROM API
  ===================================================== */
  async function fetchProfile() : Promise<void> {
    loading.value = true;

    try {
      const res = await api.get('/profile');
    
      profile.value = res.data.profile;
      history.value = res.data.history;
      console.log('profile', res.data.profile);

      // Cache local
      localStorage.setItem('profile', JSON.stringify(profile.value));
      localStorage.setItem('profile_history', JSON.stringify(history.value));

    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      loading.value = false;
    }
  }

  /* =====================================================
     UPDATE AVATAR
  ===================================================== */
  async function updateAvatar(file: File): Promise<boolean> {
    loading.value = true;

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await api.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        profile.value.avatar = res.data.avatar_url;
        
        // Update localStorage
        localStorage.setItem('profile', JSON.stringify(profile.value));
        
        return true;
      }

      return false;
    } catch (err) {
      console.error('Failed to upload avatar', err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /* =====================================================
     LOAD FROM LOCAL STORAGE
  ===================================================== */
  function loadFromStorage() {
    const storedProfile = localStorage.getItem('profile');
    const storedHistory = localStorage.getItem('profile_history');

    if (storedProfile) profile.value = JSON.parse(storedProfile);
    if (storedHistory) history.value = JSON.parse(storedHistory);
  }

  /* =====================================================
     FORCE REFRESH
  ===================================================== */
  async function refresh() {
    await fetchProfile();
  }

  return {
    profile,
    history,
    loading,

    totalGames,
    wins,
    losses,
    winRate,
    avatarUrl,

    fetchProfile,
    loadFromStorage,
    refresh,
    updateAvatar,
  };
});