<template>
  <div class="min-h-screen bg-ink-900 flex items-center justify-center p-4">
    <div class="relative w-full max-w-md animate-slide-in">
      <div class="text-center mb-8">
        <div class="inline-flex w-14 h-14 bg-accent/20 border border-accent/30 rounded-2xl items-center justify-center mb-4">
          <svg class="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        </div>
        <h1 class="font-display font-bold text-3xl text-white">Student Access</h1>
        <p class="text-ink-400 mt-1">Please enter your student access code</p>
      </div>

      <div class="card p-8">
        <p class="text-xs text-ink-400 mb-6 text-center leading-relaxed">
          Hello, <span class="text-white font-medium">{{ auth.pendingUser?.name }}</span>. 
          To access the StudentForge projects, you must enter the official student access code.
        </p>

        <form @submit.prevent="submit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-ink-200 mb-2">Access Code</label>
            <input v-model="code" type="text" placeholder="SJITC" 
              class="input text-center text-2xl tracking-[0.5em] font-mono border-accent/40 focus:border-accent focus:ring-accent/20 uppercase" 
              required autocomplete="off" />
          </div>

          <div v-if="error" class="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg animate-shake">
            {{ error }}
          </div>

          <button type="submit" :disabled="auth.loading" class="btn-primary w-full py-4 text-white shadow-lg shadow-accent/20">
            <svg v-if="auth.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ auth.loading ? 'Verifying...' : 'Unlock Dashboard' }}
          </button>
        </form>

        <button @click="auth.logout(); router.push('/login')" class="text-center w-full text-ink-400 text-sm mt-8 hover:text-white transition-colors">
          Cancel and go back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const code = ref('')
const error = ref('')

onMounted(() => {
  if (!auth.pendingUser) {
    router.push('/login')
  }
})

const submit = async () => {
  error.value = ''
  const res = await auth.verifyStudent(code.value.toUpperCase())
  if (res.success) {
    toast.success('Access granted! Welcome back.')
    router.push('/projects')
  } else {
    error.value = res.message
  }
}
</script>

<style scoped>
.animate-shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
}
</style>
