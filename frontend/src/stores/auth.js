import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => ['teacher', 'admin'].includes(user.value?.role))
  const isStudent = computed(() => user.value?.role === 'student')

  const setAuth = (u, t) => {
    user.value = u; token.value = t
    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('token', t)
  }

  const clearAuth = () => {
    user.value = null; token.value = null
    localStorage.removeItem('user'); localStorage.removeItem('token')
  }

  const login = async (email, password) => {
    loading.value = true
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    } finally { loading.value = false }
  }

  const register = async (name, email, password, role) => {
    loading.value = true
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role })
      setAuth(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' }
    } finally { loading.value = false }
  }

  const logout = () => clearAuth()
  const fetchMe = async () => {
    try {
      const { data } = await api.get('/auth/me')
      user.value = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch { clearAuth() }
  }

  return { user, token, loading, isAuthenticated, isAdmin, isTeacher, isStudent, login, register, logout, fetchMe }
})
