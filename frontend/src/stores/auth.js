import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const pendingUser = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => ['teacher', 'admin'].includes(user.value?.role))
  const isStudent = computed(() => user.value?.role === 'student')

  const setAuth = (u, t) => {
    user.value = u; token.value = t
    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('token', t)
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
    pendingUser.value = null
  }

  const clearAuth = () => {
    user.value = null; token.value = null
    localStorage.removeItem('user'); localStorage.removeItem('token')
  }

  const login = async (email, password) => {
    loading.value = true
    try {
      const { data } = await api.post('/auth/login', { email, password })
      if (data.needs2SV) {
        pendingUser.value = data.user
        return { success: true, needs2SV: true }
      }
      if (data.needsStudentVerification) {
        pendingUser.value = data.user
        return { success: true, needsStudentVerification: true }
      }
      setAuth(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    } finally { loading.value = false }
  }

  const verifyTeacher = async (code) => {
    if (!pendingUser.value) return { success: false, message: 'No pending login' }
    loading.value = true
    try {
      const { data } = await api.post('/auth/verify-teacher', { userId: pendingUser.value._id, code })
      setAuth(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Verification failed' }
    } finally { loading.value = false }
  }

  const verifyStudent = async (code) => {
    if (!pendingUser.value) return { success: false, message: 'No pending login' }
    loading.value = true
    try {
      const { data } = await api.post('/auth/verify-student', { userId: pendingUser.value._id, code })
      setAuth(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Verification failed' }
    } finally { loading.value = false }
  }

  const register = async (name, email, password, role, accessCode = '') => {
    loading.value = true
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role, accessCode })
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
