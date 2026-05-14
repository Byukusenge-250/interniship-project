import { reactive } from 'vue'
let id = 0
const toasts = reactive([])

export function useToast() {
  const add = (message, type = 'info', duration = 4000) => {
    const toast = { id: ++id, message, type }
    toasts.push(toast)
    setTimeout(() => remove(toast.id), duration)
  }
  const remove = (id) => { const i = toasts.findIndex(t => t.id === id); if (i !== -1) toasts.splice(i, 1) }
  return {
    toasts, remove,
    success: (m, d) => add(m, 'success', d),
    error: (m, d) => add(m, 'error', d),
    info: (m, d) => add(m, 'info', d),
    warning: (m, d) => add(m, 'warning', d),
  }
}
