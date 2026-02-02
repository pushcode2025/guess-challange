import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../lib/api';

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const players = ref<any[]>([]);
  const loading = ref(false);

  const topPlayers = computed(() => players.value.slice(0, 3));
 const allPlayers = computed(() => players.value);

  async function fetchLeaderboard() {
    loading.value = true;
    try {
      const res = await api.get('/leaderboard');
      players.value = res.data.data;
    } catch (e) {
      console.error('Failed to load leaderboard', e);
    } finally {
      loading.value = false;
    }
  }

  return {
    players,
    loading,
    topPlayers,
    allPlayers,
    fetchLeaderboard,
  };
});
