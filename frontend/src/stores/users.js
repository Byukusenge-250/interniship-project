import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const stats = ref(null)
  const loading = ref(false)

  const fetchUsers = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await api.get('/users', { params })
      users.value = data.users
      return { success: true }
    } catch (err) { return { success: false, message: err.response?.data?.message || 'Failed' } }
    finally { loading.value = false }
  }

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/users/stats')
      stats.value = data
    } catch {}
  }

  const updateRole = async (id, role) => {
    try {
      const { data } = await api.patch(`/users/${id}/role`, { role })
      const idx = users.value.findIndex(u => u._id === id)
      if (idx !== -1) users.value[idx] = { ...users.value[idx], role: data.user.role }
      return { success: true }
    } catch (err) { return { success: false, message: err.response?.data?.message || 'Failed' } }
  }

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/users/${id}/status`, { status })
      const idx = users.value.findIndex(u => u._id === id)
      if (idx !== -1) users.value[idx] = { ...users.value[idx], status: data.user.status }
      return { success: true }
    } catch (err) { return { success: false, message: err.response?.data?.message || 'Failed' } }
  }

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`)
      users.value = users.value.filter(u => u._id !== id)
      return { success: true }
    } catch (err) { return { success: false, message: err.response?.data?.message || 'Failed' } }
  }

  return { users, stats, loading, fetchUsers, fetchStats, updateRole, updateStatus, deleteUser }
})
