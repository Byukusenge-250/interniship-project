<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <RouterLink to="/projects" class="flex items-center gap-2 text-ink-400 hover:text-white text-sm mb-6 w-fit transition-colors group">
      <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
      Back to Projects
    </RouterLink>

    <!-- Loading -->
    <div v-if="loading" class="space-y-6">
      <div class="card h-48 animate-pulse"></div>
      <div class="card h-32 animate-pulse"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card p-12 text-center">
      <p class="text-4xl mb-4">😕</p>
      <h3 class="font-display font-bold text-xl text-white mb-2">Project Not Found</h3>
      <p class="text-ink-400">{{ error }}</p>
    </div>

    <!-- Project Detail -->
    <div v-else-if="project" class="animate-fade-in">
      <!-- Header -->
      <div class="card overflow-hidden mb-6">
        <div class="h-48 bg-gradient-to-br from-ink-700 to-ink-900 relative flex items-center justify-center">
          <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title" class="w-full h-full object-cover" @error="e => e.target.style.display='none'" />
          <span v-else class="text-7xl">{{ emoji }}</span>
          <div class="absolute top-4 right-4"><span :class="'badge-' + project.status" class="badge text-sm px-3 py-1">{{ project.status }}</span></div>
          <div class="absolute top-4 left-4"><span class="badge bg-ink-900/80 text-ink-300 border-ink-600/50 uppercase tracking-wider">{{ project.category }}</span></div>
        </div>
        <div class="p-8">
          <h1 class="font-display font-bold text-3xl text-white mb-4">{{ project.title }}</h1>
          <p class="text-ink-300 leading-relaxed text-lg">{{ project.description }}</p>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <!-- Technologies -->
        <div class="card p-6">
          <h2 class="font-display font-bold text-lg text-white mb-4">Technologies Used</h2>
          <div class="flex flex-wrap gap-2">
            <span v-for="t in project.technologies" :key="t" class="px-3 py-1.5 bg-accent/10 text-accent-light rounded-lg text-sm font-mono border border-accent/20">{{ t }}</span>
          </div>
          <p v-if="!project.technologies?.length" class="text-ink-500 text-sm">No technologies listed</p>
        </div>

        <!-- Author & Meta -->
        <div class="card p-6">
          <h2 class="font-display font-bold text-lg text-white mb-4">Project Info</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-accent/20 text-accent border border-accent/30">{{ project.userId?.name?.[0]?.toUpperCase() }}</div>
              <div>
                <p class="text-white font-medium">{{ project.userId?.name || 'Unknown' }}</p>
                <p class="text-ink-500 text-xs">{{ project.userId?.email }}</p>
              </div>
              <span :class="'badge-' + (project.userId?.role || 'student')" class="badge ml-auto capitalize">{{ project.userId?.role }}</span>
            </div>
            <div class="border-t border-ink-700 pt-3 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-ink-400">Category</span>
                <span class="text-white capitalize">{{ project.category }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-ink-400">Status</span>
                <span :class="project.status === 'approved' ? 'text-emerald-400' : project.status === 'rejected' ? 'text-rose-400' : 'text-amber-400'" class="capitalize font-medium">{{ project.status }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-ink-400">Created</span>
                <span class="text-ink-200 font-mono text-xs">{{ fmtDate(project.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Links -->
      <div v-if="project.githubUrl || project.liveUrl" class="card p-6">
        <h2 class="font-display font-bold text-lg text-white mb-4">Links</h2>
        <div class="flex flex-wrap gap-3">
          <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="btn-secondary px-5 py-2.5">
            ⬡ View on GitHub
          </a>
          <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="btn-primary px-5 py-2.5">
            ↗ Live Demo
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '../api'

const route = useRoute()
const project = ref(null)
const loading = ref(true)
const error = ref('')

const emoji = computed(() => ({ web:'🌐', mobile:'📱', ai:'🤖', data:'📊', game:'🎮', other:'💡' })[project.value?.category] || '💡')
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

const fetchProject = async (id) => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get(`/projects/${id}`)
    project.value = data.project
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load project'
  } finally {
    loading.value = false
  }
}

// Watch for route param changes (item 22: watch usage)
watch(() => route.params.id, (newId) => {
  if (newId) fetchProject(newId)
}, { immediate: true })
</script>
