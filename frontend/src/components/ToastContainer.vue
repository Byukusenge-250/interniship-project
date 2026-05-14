<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div v-for="t in toastStore.toasts" :key="t.id"
          class="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl min-w-[260px] max-w-[360px]"
          :class="{
            'bg-emerald-500/15 border-emerald-500/30 text-emerald-300': t.type==='success',
            'bg-rose-500/15 border-rose-500/30 text-rose-300': t.type==='error',
            'bg-amber-500/15 border-amber-500/30 text-amber-300': t.type==='warning',
            'bg-accent/15 border-accent/30 text-accent-light': t.type==='info',
          }">
          <span class="text-base">{{ { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' }[t.type] }}</span>
          <p class="text-sm font-body flex-1">{{ t.message }}</p>
          <button @click="toastStore.remove(t.id)" class="opacity-50 hover:opacity-100">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast'
const toastStore = useToast()
</script>

<style scoped>
.toast-enter-active { transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-leave-active { transition: all 0.25s ease-in; }
.toast-enter-from { opacity: 0; transform: translateY(16px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: scale(0.9); }
</style>
