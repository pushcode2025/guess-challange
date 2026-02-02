import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

/**
 * ✅ Lazy Loaded Components
 * كل صفحة تتحمل فقط عند الحاجة
 */
const AuthScreen = () => import('../components/AuthScreen.vue');
const HomePage = () => import('../components/HomePage.vue');
const ProfilePage = () => import('../components/ProfilePage.vue');
const GameScreen = () => import('../components/GameScreen.vue');
const ResultScreen = () => import('../components/ResultScreen.vue');
const LeaderboardScreen = () => import('../components/LeaderboardScreen.vue');

/**
 * ❌ SettingsModal لا يجب يكون Route
 * هو Modal داخل App.vue
 */

const routes = [
  {
    path: '/',
    name: 'auth',
    component: AuthScreen,
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
  },
  {
    path: '/game',
    name: 'game',
    component: GameScreen,
  },
  {
    path: '/result',
    name: 'result',
    component: ResultScreen,
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: LeaderboardScreen,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/**
 * ✅ Auth Guard نظيف وسريع
 */
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // تهيئة auth مرة وحدة فقط
  if (!auth.initialized) {
    await auth.init();
  }

  const publicPages = ['auth'];
  const authRequired = !publicPages.includes(to.name as string);

  // غير مسجل → رجعه على auth
  if (authRequired && !auth.isAuthenticated) {
    return next({ name: 'auth' });
  }

  // مسجل ودخل على auth → رجعه home
  if (to.name === 'auth' && auth.isAuthenticated) {
    return next({ name: 'home' });
  }

  next();
});

export default router;
