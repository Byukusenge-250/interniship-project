<template>
  <div class="min-h-screen bg-ink-900 flex items-center justify-center p-4">
    <!-- Back Home Button -->
    <RouterLink to="/" class="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-ink-800/80 hover:bg-ink-700 border border-white/10 rounded-full text-sm text-ink-300 hover:text-white transition-all backdrop-blur-md group">
      <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
      Home
    </RouterLink>

    <div class="relative w-full max-w-md animate-slide-in">
      <div class="text-center mb-8">
        <h1 class="font-display font-bold text-3xl text-white">Create Account</h1>
        <p class="text-ink-400 mt-1">Join StudentForge</p>
      </div>
      <div class="card p-8">
        <form @submit.prevent="submit" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-ink-200 mb-2">Full Name</label>
            <input v-model="form.name" type="text" placeholder="Jane Smith" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-200 mb-2">Email</label>
            <input v-model="form.email" type="email" placeholder="you@university.edu" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-200 mb-2">Password</label>
            <input v-model="form.password" type="password" placeholder="Min 6 characters" class="input" required minlength="6" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-200 mb-3">I am a...</label>
            <div class="grid grid-cols-2 gap-3">
              <button v-for="r in roles" :key="r.value" type="button" @click="form.role = r.value"
                class="p-4 rounded-xl border-2 transition-all text-center"
                :class="form.role === r.value ? 'border-accent bg-accent/10' : 'border-ink-600 bg-ink-700/50 hover:border-ink-500'">
                <div class="text-2xl mb-1">{{ r.icon }}</div>
                <div class="text-sm font-medium" :class="form.role === r.value ? 'text-white' : 'text-ink-300'">{{ r.label }}</div>
              </button>
            </div>
          </div>
          <div v-if="form.role === 'teacher'" class="animate-slide-in">
            <label class="block text-sm font-medium text-ink-200 mb-2">Teacher Access Code</label>
            <input v-model="form.accessCode" type="password" placeholder="Enter teacher secret code" class="input border-amber-500/50 focus:ring-amber-500/50" required />
            <p class="text-[10px] text-amber-400/80 mt-1.5 ml-1">🔒 Only authorized staff can register as teachers.</p>
          </div>

          <div v-if="error" class="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg">{{ error }}</div>
          <button type="submit" :disabled="auth.loading" class="btn-primary w-full py-3">
            {{ auth.loading ? 'Creating...' : 'Create Account' }}
          </button>
        </form>
        <p class="text-center text-ink-400 text-sm mt-6">
          Already have an account? <RouterLink to="/login" class="text-accent hover:text-accent-light">Sign in</RouterLink>
        </p>
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
const form = reactive({ name: '', email: '', password: '', role: 'student', accessCode: '' })
const error = ref('')
const roles = [
  { value: 'student', icon: '🎓', label: 'Student' },
  { value: 'teacher', icon: '👨‍🏫', label: 'Teacher' },
]

const submit = async () => {
  error.value = ''
  const res = await auth.register(form.name, form.email, form.password, form.role, form.accessCode)
  if (res.success) {
    toast.success('Account created! Welcome 🎉')
    router.push(auth.isTeacher ? '/teacher' : '/projects')
  } else error.value = res.message
}
</script>
