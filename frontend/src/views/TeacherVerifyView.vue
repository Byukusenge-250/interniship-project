<template>
  <div class="min-h-screen bg-ink-900 flex items-center justify-center p-4">
    <div class="relative w-full max-w-md animate-slide-in">
      <div class="text-center mb-8">
        <div class="inline-flex w-14 h-14 bg-amber-500/20 border border-amber-500/30 rounded-2xl items-center justify-center mb-4">
          <svg class="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 class="font-display font-bold text-3xl text-white">Teacher Verification</h1>
        <p class="text-ink-400 mt-1">Please enter your 2-step verification code</p>
      </div>

      <div class="card p-8">
        <p class="text-xs text-ink-400 mb-6 text-center leading-relaxed">
          Hello, <span class="text-white font-medium">{{ auth.pendingUser?.name }}</span>. 
          To protect teacher accounts, we require a verification code to proceed to the dashboard.
        </p>

        <form @submit.prevent="submit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-ink-200 mb-2">Verification Code</label>
            <input v-model="code" type="password" placeholder="••••" 
              class="input text-center text-2xl tracking-[1em] font-mono border-amber-500/40 focus:border-amber-500 focus:ring-amber-500/20" 
              required autocomplete="off" maxlength="10" />
          </div>

          <div v-if="error" class="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg animate-shake">
            {{ error }}
          </div>

          <button type="submit" :disabled="auth.loading" class="btn-primary w-full py-4 bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20">
            <svg v-if="auth.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ auth.loading ? 'Verifying...' : 'Verify and Access' }}
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
  const res = await auth.verifyTeacher(code.value)
  if (res.success) {
    toast.success('Identity verified! Welcome to Teacher Panel.')
    router.push('/teacher')
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
