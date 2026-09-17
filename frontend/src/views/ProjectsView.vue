<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="font-display font-bold text-3xl text-white mb-1">Projects</h1>
        <p class="text-ink-400">Browse all student projects</p>
      </div>
      <RouterLink v-if="auth.isStudent" to="/projects/new" class="btn-primary">
        + Upload Project
      </RouterLink>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input v-model="search" type="text" placeholder="Search projects..." class="input flex-1" @input="debounce" />
      <select v-model="categoryFilter" @change="load" class="input sm:w-40">
        <option value="">All Categories</option>
        <option value="web">Web</option>
        <option value="mobile">Mobile</option>
        <option value="data">Data Science</option>
        <option value="game">Game</option>
        <option value="other">Other</option>
      </select>
      <select v-model="statusFilter" @change="load" class="input sm:w-40">
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
        <option value="">All</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="pStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card h-64 animate-pulse" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!pStore.projects.length" class="card p-12 text-center">
      <p class="text-4xl mb-4">📁</p>
      <h3 class="font-display font-bold text-lg text-white mb-2">No projects found</h3>
      <p class="text-ink-400 mb-4">Try adjusting your filters or be the first to upload a project.</p>
      <RouterLink v-if="auth.isStudent" to="/projects/new" class="btn-primary inline-flex">Upload Project</RouterLink>
    </div>

    <!-- Projects grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard v-for="p in pStore.projects" :key="p._id" :project="p" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import { useAuthStore } from '../stores/auth'
import ProjectCard from '../components/ProjectCard.vue'

const pStore = useProjectsStore()
const auth = useAuthStore()

const search = ref('')
const categoryFilter = ref('')
const statusFilter = ref('approved')
let timer = null

const load = () => {
  const params = {}
  if (statusFilter.value) params.status = statusFilter.value
  if (categoryFilter.value) params.category = categoryFilter.value
  if (search.value.trim()) params.search = search.value.trim()
  pStore.fetchProjects(params)
}

const debounce = () => { clearTimeout(timer); timer = setTimeout(load, 350) }

onMounted(load)
</script>
