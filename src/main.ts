import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './styles/intro-theme.css'
import i18n from './i18n'
import App from './App.vue'
import router from './router'
import { buildImageUrl } from './utils/image'
import { useAuthStore } from './stores/auth'

async function bootstrap():Promise<void> {
  const app = createApp(App)

  const pinia = createPinia()
  app.use(pinia)

  const authStore = useAuthStore()
  await authStore.init()

  app.use(i18n)
  app.use(router)

  app.config.globalProperties.$image = buildImageUrl
  app.mount('#app')
}

bootstrap()
