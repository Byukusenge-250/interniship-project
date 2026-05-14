<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display font-bold text-3xl text-white">Projects</h1>
        <p class="text-ink-400 mt-1">{{ store.projects.length }} project(s)</p>
      </div>
      <RouterLink v-if="!auth.isAdmin" to="/projects/new" class="btn-primary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Upload
      </RouterLink>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input v-model="search" type="text" placeholder="Search..." class="input flex-1" @input="debounce" />
      <select v-model="category" @change="load" class="input sm:w-44">
        <option value="all">All Categories</option>
        <option value="web">🌐 Web</option>
        <option value="mobile">📱 Mobile</option>
        <option value="ai">🤖 AI/ML</option>
        <option value="data">📊 Data</option>
        <option value="game">🎮 Game</option>
        <option value="other">💡 Other</option>
      </select>
      <select v-if="auth.isTeacher" v-model="status" @change="load" class="input sm:w-40">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card h-72 animate-pulse" />
    </div>

    <div v-else-if="!store.projects.length" class="text-center py-20">
      <p class="text-5xl mb-4">🔭</p>
      <h3 class="font-display font-bold text-xl text-white mb-2">No projects found</h3>
      <p class="text-ink-400">Try adjusting your filters</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard v-for="p in store.projects" :key="p._id" :project="p">
        <template v-if="auth.isTeacher" #actions>
          <div class="flex gap-2 mt-3 pt-3 border-t border-ink-700">
            <button v-if="p.status !== 'approved'" @click="setStatus(p, 'approved')" class="btn-success text-xs py-1.5 flex-1">✓ Approve</button>
            <button v-if="p.status !== 'rejected'" @click="setStatus(p, 'rejected')" class="btn-warning text-xs py-1.5 flex-1">✕ Reject</button>
            <button @click="toDelete = p" class="btn-danger text-xs py-1.5 px-3">🗑</button>
          </div>
        </template>
      </ProjectCard>
    </div>

    <ConfirmDialog :show="!!toDelete" title="Delete Project?"
      :message="`Delete &quot;${toDelete?.title}&quot;? This cannot be undone.`"
      confirm-text="Delete" :loading="deleting"
      @confirm="doDelete" @cancel="toDelete = null" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProjectsStore } from '../stores/projects'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import ProjectCard from '../components/ProjectCard.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const store = useProjectsStore()
const auth = useAuthStore()
const toast = useToast()

const search = ref(''), category = ref('all'), status = ref('')
const toDelete = ref(null), deleting = ref(false)
let timer = null

const load = () => {
  const p = {}
  if (category.value !== 'all') p.category = category.value
  if (status.value) p.status = status.value
  if (search.value.trim()) p.search = search.value.trim()
  store.fetchProjects(p)
}
const debounce = () => { clearTimeout(timer); timer = setTimeout(load, 350) }

const setStatus = async (project, s) => {
  const res = await store.updateStatus(project._id, s)
  if (res.success) toast.success(`Project ${s}`)
  else toast.error(res.message)
}

const doDelete = async () => {
  deleting.value = true
  const res = await store.deleteProject(toDelete.value._id)
  deleting.value = false
  if (res.success) { toast.success('Project deleted'); toDelete.value = null }
  else toast.error(res.message)
}

onMounted(load)
</script>
