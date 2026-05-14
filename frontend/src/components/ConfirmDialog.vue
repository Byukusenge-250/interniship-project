<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('cancel')" />
        <div class="relative bg-ink-800 border border-ink-600 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-in">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
              :class="type === 'danger' ? 'bg-rose-500/20 border border-rose-500/30' : 'bg-amber-500/20 border border-amber-500/30'">
              <span class="text-lg">{{ type === 'danger' ? '🗑️' : '⚠️' }}</span>
            </div>
            <div>
              <h3 class="font-display font-bold text-white text-lg">{{ title }}</h3>
              <p class="text-ink-300 text-sm mt-1 font-body leading-relaxed">{{ message }}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="$emit('cancel')" class="btn-secondary flex-1">Cancel</button>
            <button @click="$emit('confirm')" :disabled="loading"
              class="flex-1"
              :class="type === 'danger' ? 'btn-danger' : 'btn-warning'">
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ loading ? 'Processing...' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: 'This cannot be undone.' },
  confirmText: { type: String, default: 'Confirm' },
  type: { type: String, default: 'danger' },
  loading: Boolean
})
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
