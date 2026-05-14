<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="card p-8 mb-8">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-display border-2 flex-shrink-0"
          :class="auth.isAdmin ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : auth.isTeacher ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-accent/20 text-accent border-accent/40'">
          {{ auth.user?.name?.[0]?.toUpperCase() }}
        </div>
        <div>
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="font-display font-bold text-2xl text-white">{{ auth.user?.name }}</h1>
            <span :class="'badge-' + auth.user?.role" class="badge capitalize">{{ auth.user?.role }}</span>
          </div>
          <p class="text-ink-400 mt-0.5">{{ auth.user?.email }}</p>
        </div>
      </div>
      <div v-if="!auth.isAdmin" class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-ink-700">
        <div class="text-center">
          <p class="font-display font-bold text-2xl text-white">{{ store.myProjects.length }}</p>
          <p class="text-ink-400 text-sm">Projects</p>
        </div>
        <div class="text-center">
          <p class="font-display font-bold text-2xl text-emerald-400">{{ store.myProjects.filter(p=>p.status==='approved').length }}</p>
          <p class="text-ink-400 text-sm">Approved</p>
        </div>
        <div class="text-center">
          <p class="font-display font-bold text-2xl text-amber-400">{{ store.myProjects.filter(p=>p.status==='pending').length }}</p>
          <p class="text-ink-400 text-sm">Pending</p>
        </div>
      </div>
    </div>

    <div v-if="!auth.isAdmin">
      <h2 class="font-display font-bold text-xl text-white mb-4">My Projects</h2>
      <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="card h-64 animate-pulse" />
      </div>
      <div v-else-if="!store.myProjects.length" class="card p-12 text-center">
        <p class="text-5xl mb-4">📁</p>
        <h3 class="font-display font-bold text-lg text-white mb-2">No projects yet</h3>
        <RouterLink to="/projects/new" class="btn-primary inline-flex mt-4">Upload First Project</RouterLink>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ProjectCard v-for="p in store.myProjects" :key="p._id" :project="p" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useProjectsStore } from '../stores/projects'
import ProjectCard from '../components/ProjectCard.vue'

const auth = useAuthStore()
const store = useProjectsStore()
onMounted(() => { if (!auth.isAdmin) store.fetchMyProjects() })
</script>
