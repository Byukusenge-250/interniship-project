<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center gap-3 mb-2">
      <span class="w-2 h-2 rounded-full bg-amber-400"></span>
      <span class="text-amber-400 text-xs font-mono uppercase tracking-wider">Teacher Panel</span>
    </div>
    <h1 class="font-display font-bold text-3xl text-white mb-1">Project Management</h1>
    <p class="text-ink-400 mb-8">Review and manage student project submissions</p>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div v-for="s in stats" :key="s.label" class="card p-4 text-center">
        <p class="font-display font-bold text-2xl" :class="s.color">{{ s.value }}</p>
        <p class="text-ink-400 text-sm mt-1">{{ s.label }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input v-model="search" type="text" placeholder="Search projects..." class="input flex-1" @input="debounce" />
      <select v-model="statusFilter" @change="load" class="input sm:w-40">
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-ink-700 bg-ink-900/50 text-xs font-mono uppercase tracking-wider text-ink-400">
        <div class="col-span-4">Project</div>
        <div class="col-span-2">Student</div>
        <div class="col-span-2">Date</div>
        <div class="col-span-1">Status</div>
        <div class="col-span-3 text-right">Actions</div>
      </div>

      <div v-if="pStore.loading" class="p-8 text-center text-ink-400">Loading...</div>

      <div v-else-if="!filtered.length" class="p-12 text-center">
        <p class="text-4xl mb-3">📋</p>
        <p class="text-ink-400">No projects found</p>
      </div>

      <div v-for="(p, i) in filtered" :key="p._id"
        class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-6 py-4 border-b border-ink-700/40 last:border-0 hover:bg-ink-700/20 transition-colors animate-fade-in"
        :style="{animationDelay: i*20+'ms'}">
        <!-- Project -->
        <div class="md:col-span-4 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-ink-700 border border-ink-600 flex items-center justify-center text-lg flex-shrink-0">
            {{ emoji(p.category) }}
          </div>
          <div class="min-w-0">
            <p class="font-display font-semibold text-white text-sm truncate">{{ p.title }}</p>
            <p class="text-ink-500 text-xs truncate">{{ p.description?.slice(0,45) }}...</p>
          </div>
        </div>
        <!-- Student -->
        <div class="md:col-span-2">
          <p class="text-ink-200 text-sm">{{ p.userId?.name || 'Unknown' }}</p>
          <p class="text-ink-500 text-xs truncate">{{ p.userId?.email }}</p>
        </div>
        <!-- Date -->
        <div class="md:col-span-2">
          <p class="text-ink-400 text-xs font-mono">{{ fmt(p.createdAt) }}</p>
        </div>
        <!-- Status -->
        <div class="md:col-span-1">
          <span :class="'badge-'+p.status" class="badge">{{ p.status }}</span>
        </div>
        <!-- Actions -->
        <div class="md:col-span-3 flex items-center gap-2 justify-start md:justify-end flex-wrap">
          <button v-if="p.status !== 'approved'" @click="setStatus(p,'approved')" class="btn-success text-xs py-1.5 px-3">✓ Approve</button>
          <button v-if="p.status !== 'rejected'" @click="setStatus(p,'rejected')" class="btn-warning text-xs py-1.5 px-3">✕ Reject</button>
          <button @click="toDelete = p" class="btn-danger text-xs py-1.5 px-3">🗑</button>
        </div>
      </div>
    </div>

    <ConfirmDialog :show="!!toDelete" title="Delete Project?"
      :message="`Delete &quot;${toDelete?.title}&quot;? This cannot be undone.`"
      confirm-text="Delete" :loading="deleting"
      @confirm="doDelete" @cancel="toDelete = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '../stores/projects'
import { useToast } from '../composables/useToast'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const pStore = useProjectsStore()
const toast = useToast()
const search = ref(''), statusFilter = ref(''), toDelete = ref(null), deleting = ref(false)
let timer = null

const load = () => {
  const p = {}
  if (statusFilter.value) p.status = statusFilter.value
  if (search.value.trim()) p.search = search.value.trim()
  pStore.fetchProjects(p)
}
const debounce = () => { clearTimeout(timer); timer = setTimeout(load, 350) }

const filtered = computed(() => pStore.projects)

const stats = computed(() => [
  { label: 'Total', value: pStore.projects.length, color: 'text-white' },
  { label: 'Pending', value: pStore.projects.filter(p=>p.status==='pending').length, color: 'text-amber-400' },
  { label: 'Approved', value: pStore.projects.filter(p=>p.status==='approved').length, color: 'text-emerald-400' },
  { label: 'Rejected', value: pStore.projects.filter(p=>p.status==='rejected').length, color: 'text-rose-400' },
])

const emoji = c => ({ web:'🌐', mobile:'📱', ai:'🤖', data:'📊', game:'🎮', other:'💡' })[c] || '💡'
const fmt = d => d ? new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : ''

const setStatus = async (p, s) => {
  const res = await pStore.updateStatus(p._id, s)
  if (res.success) toast.success(`Project ${s}`)
  else toast.error(res.message)
}

const doDelete = async () => {
  deleting.value = true
  const res = await pStore.deleteProject(toDelete.value._id)
  deleting.value = false
  if (res.success) { toast.success('Deleted'); toDelete.value = null }
  else toast.error(res.message)
}

onMounted(load)
</script>
