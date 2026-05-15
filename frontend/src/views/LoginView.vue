<template>
  <div class="min-h-screen bg-ink-900 flex items-center justify-center p-4">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
    </div>

    <!-- Back Home Button -->
    <RouterLink to="/" class="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-ink-800/80 hover:bg-ink-700 border border-white/10 rounded-full text-sm text-ink-300 hover:text-white transition-all backdrop-blur-md group">
      <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
      Home
    </RouterLink>

    <div class="relative w-full max-w-md animate-slide-in">
      <div class="text-center mb-8">
        <div class="inline-flex w-14 h-14 bg-accent rounded-2xl items-center justify-center mb-4">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h1 class="font-display font-bold text-3xl text-white">StudentForge</h1>
        <p class="text-ink-400 mt-1">Sign in to your account</p>
      </div>

      <div class="card p-8">
        <form @submit.prevent="submit" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-ink-200 mb-2">Email</label>
            <input v-model="form.email" type="email" placeholder="you@university.edu" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-200 mb-2">Password</label>
            <input v-model="form.password" type="password" placeholder="••••••••" class="input" required />
          </div>
          <div v-if="error" class="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg">{{ error }}</div>
          <button type="submit" :disabled="auth.loading" class="btn-primary w-full py-3">
            <svg v-if="auth.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ auth.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <p class="text-center text-ink-400 text-sm mt-6">
          No account? <RouterLink to="/register" class="text-accent hover:text-accent-light">Register</RouterLink>
        </p>
      </div>

      <!-- Demo accounts -->
      <div class="mt-4 card p-4">
        <p class="text-ink-400 text-xs font-mono text-center mb-3">Quick demo login</p>
        <div class="grid grid-cols-3 gap-2">
          <button v-for="d in demos" :key="d.role" @click="fill(d)" class="text-xs px-2 py-2 bg-ink-700 hover:bg-ink-600 rounded-lg text-ink-300 hover:text-white transition-colors font-mono text-center">
            {{ d.icon }} {{ d.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const form = reactive({ email: '', password: '' })
const error = ref('')

const demos = [
  { role: 'admin', icon: '🔐', label: 'Admin', email: 'admin@demo.com', password: 'admin12' },
  { role: 'teacher', icon: '👨‍🏫', label: 'Teacher', email: 'teacher@demo.com', password: 'teacher12' },
  { role: 'student', icon: '🎓', label: 'Student', email: 'student@demo.com', password: 'password123' },
]

const fill = (d) => { form.email = d.email; form.password = d.password }

const submit = async () => {
  error.value = ''
  const res = await auth.login(form.email, form.password)
  if (res.success) {
    if (res.needs2SV) {
      router.push('/verify-teacher')
      return
    }
    if (res.needsStudentVerification) {
      router.push('/verify-student')
      return
    }
    toast.success(`Welcome back, ${auth.user.name}!`)
    if (auth.isAdmin) router.push('/admin')
    else if (auth.isTeacher) router.push('/teacher')
    else router.push('/projects')
  } else {
    error.value = res.message
  }
}
</script>
