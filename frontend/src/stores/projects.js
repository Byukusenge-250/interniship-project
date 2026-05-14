import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const myProjects = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchProjects = async (params = {}) => {
    loading.value = true; error.value = null
    try {
      const { data } = await api.get('/projects', { params })
      projects.value = data.projects
    } catch (err) { error.value = err.response?.data?.message || 'Failed' }
    finally { loading.value = false }
  }

  const fetchMyProjects = async () => {
    loading.value = true
    try { const { data } = await api.get('/projects/my'); myProjects.value = data.projects }
    catch (err) { error.value = err.response?.data?.message || 'Failed' }
    finally { loading.value = false }
  }

  const createProject = async (projectData) => {
    try {
      const { data } = await api.post('/projects', projectData)
      projects.value.unshift(data.project)
      myProjects.value.unshift(data.project)
      return { success: true, project: data.project }
    } catch (err) { return { success: false, message: err.response?.data?.message || 'Failed' } }
  }

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`)
      projects.value = projects.value.filter(p => p._id !== id)
      myProjects.value = myProjects.value.filter(p => p._id !== id)
      return { success: true }
    } catch (err) { return { success: false, message: err.response?.data?.message || 'Failed' } }
  }

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/projects/${id}/status`, { status })
      const idx = projects.value.findIndex(p => p._id === id)
      if (idx !== -1) projects.value[idx] = data.project
      return { success: true }
    } catch (err) { return { success: false, message: err.response?.data?.message || 'Failed' } }
  }
  const updateProject = async (id, projectData) => {
    try {
      const { data } = await api.put(`/projects/${id}`, projectData)
      const idx = projects.value.findIndex(p => p._id === id)
      if (idx !== -1) projects.value[idx] = data.project
      return { success: true, project: data.project }
    } catch (err) { return { success: false, message: err.response?.data?.message || 'Failed' } }
  }

  return { projects, myProjects, loading, error, fetchProjects, fetchMyProjects, createProject, deleteProject, updateStatus, updateProject }
})
