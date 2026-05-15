<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-ink-900/95 backdrop-blur-md border-b border-ink-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/projects" class="flex items-center gap-2 group">
        <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <span class="font-display font-bold text-lg text-white">StudentForge</span>
      </RouterLink>

      <!-- Nav links -->
      <div class="hidden md:flex items-center gap-1">
        <NavLink to="/">
          <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
            Home
          </span>
        </NavLink>
        <NavLink to="/projects">Browse</NavLink>
        <NavLink v-if="auth.isStudent" to="/projects/new">Upload Project</NavLink>
        <NavLink v-if="auth.isTeacher && !auth.isAdmin" to="/teacher">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Teacher Panel
          </span>
        </NavLink>
        <NavLink v-if="auth.isAdmin" to="/admin">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            Admin Panel
          </span>
        </NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>

      <!-- User info + logout -->
      <div class="flex items-center gap-3">
        <div class="hidden sm:flex items-center gap-2">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            :class="auth.isAdmin ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : auth.isTeacher ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-accent/20 text-accent border border-accent/30'">
            {{ auth.user?.name?.[0]?.toUpperCase() }}
          </div>
          <div>
            <p class="text-xs text-white font-medium leading-none">{{ auth.user?.name }}</p>
            <span class="text-[10px]" :class="roleBadgeClass">{{ auth.user?.role }}</span>
          </div>
        </div>
        <button @click="logout" class="btn-ghost p-2 text-ink-400 hover:text-rose-400" title="Logout">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import NavLink from './NavLink.vue'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const roleBadgeClass = computed(() => {
  if (auth.isAdmin) return 'text-rose-400 font-mono'
  if (auth.isTeacher) return 'text-amber-400 font-mono'
  return 'text-accent-light font-mono'
})

const logout = () => {
  auth.logout()
  toast.info('Logged out')
  router.push('/')
}
</script>
