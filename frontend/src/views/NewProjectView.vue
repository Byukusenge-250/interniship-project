<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <RouterLink to="/projects" class="flex items-center gap-2 text-ink-400 hover:text-white text-sm mb-6 w-fit transition-colors">← Back</RouterLink>
    <h1 class="font-display font-bold text-3xl text-white mb-2">Upload Project</h1>
    <p class="text-ink-400 mb-8">Share your work with the community</p>
    <div class="card p-8">
      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-ink-200 mb-2">Title *</label>
          <input v-model="form.title" class="input" placeholder="My Awesome Project" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-200 mb-2">Description *</label>
          <textarea v-model="form.description" class="input resize-none" rows="4" placeholder="What does your project do?" required minlength="10" />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-200 mb-2">Category</label>
          <select v-model="form.category" class="input">
            <option value="web">🌐 Web</option>
            <option value="mobile">📱 Mobile</option>
            <option value="ai">🤖 AI/ML</option>
            <option value="data">📊 Data Science</option>
            <option value="game">🎮 Game</option>
            <option value="other">💡 Other</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-200 mb-2">Technologies <span class="text-ink-500 font-normal">(comma-separated)</span></label>
          <input v-model="form.technologies" class="input" placeholder="Vue.js, Node.js, MongoDB" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-ink-200 mb-2">GitHub URL</label>
            <input v-model="form.githubUrl" type="url" class="input" placeholder="https://github.com/..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-200 mb-2">Live URL</label>
            <input v-model="form.liveUrl" type="url" class="input" placeholder="https://..." />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-200 mb-2">Screenshot URL</label>
          <input v-model="form.imageUrl" type="url" class="input" placeholder="https://i.imgur.com/..." />
        </div>
        <div v-if="error" class="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg">{{ error }}</div>
        <div class="flex gap-3">
          <RouterLink to="/projects" class="btn-secondary flex-1 text-center">Cancel</RouterLink>
          <button type="submit" :disabled="loading" class="btn-primary flex-1">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ loading ? 'Uploading...' : 'Upload Project' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import { useToast } from '../composables/useToast'

const store = useProjectsStore()
const router = useRouter()
const toast = useToast()
const loading = ref(false), error = ref('')
const form = reactive({ title:'', description:'', category:'web', technologies:'', githubUrl:'', liveUrl:'', imageUrl:'' })

const submit = async () => {
  loading.value = true; error.value = ''
  const res = await store.createProject({ ...form, technologies: form.technologies.split(',').map(t=>t.trim()).filter(Boolean) })
  loading.value = false
  if (res.success) { toast.success('Project uploaded! Awaiting approval.'); router.push('/projects') }
  else error.value = res.message
}
</script>
