import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../lib/api'
import type { User } from '../models/User'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const initialized = ref(false)

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  /* =========================
     INIT (🔥 أهم جزء)
  ========================= */
  async function init() {
    // 1️⃣ التقط التوكن من URL (Google iOS Redirect)
    const url = new URL(window.location.href)
    const urlToken = url.searchParams.get('token')

    if (urlToken) {
      setAuth(null, urlToken)

      // نظّف الرابط
      url.searchParams.delete('token')
      window.history.replaceState({}, '', url.pathname)
    }

    // 2️⃣ لو في token مخزّن
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      token.value = storedToken
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      await validateToken()
    }

    initialized.value = true
  }

  /* =========================
     Core: Validate Token
  ========================= */
  async function validateToken() {
    if (!token.value) {
      logout()
      return
    }

    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      const response = await api.get('/auth/me')

      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error) {
      logout()
    }
  }

  /* =========================
     Login (Google Popup)
  ========================= */
  async function loginWithGoogle(accessToken: string) {
    const response = await api.post('/auth/google', { token: accessToken })
    const data = response.data.data

    setAuth(data.user, data.token)
    return true
  }

  /* =========================
     Login (Manual)
  ========================= */
  async function loginManual(name: string, email: string) {
    const response = await api.post('/auth/manual', { name, email })
    const data = response.data.data

    setAuth(data.user, data.token)
    return true
  }

  /* =========================
     OTP Flow
  ========================= */
  async function sendOtp(email: string, name: string) {
    const response = await api.post('/auth/send-otp', { email, name })
    return response.data.data
  }

  async function resendOtp(email: string) {
    const response = await api.post('/auth/resend-otp', { email })
    return response.data.data
  }

  async function verifyOtp(email: string, otp: string) {
    const response = await api.post('/auth/verify-otp', { email, otp })
    const data = response.data.data

    setAuth(data.user, data.token)
    return true
  }

  /* =========================
     Helpers
  ========================= */
  function setAuth(userData: User | null, authToken: string) {
    token.value = authToken
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    localStorage.setItem('auth_token', authToken)

    if (userData) {
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  function logout() {
    user.value = null
    token.value = null

    delete api.defaults.headers.common['Authorization']

    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    initialized,
    init,

    isAuthenticated,
    loginWithGoogle,
    loginManual,
    sendOtp,
    resendOtp,
    verifyOtp,
    logout,
    validateToken,
  }
})
