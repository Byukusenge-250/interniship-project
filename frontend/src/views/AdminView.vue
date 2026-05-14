<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-2">
      <span class="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
      <span class="text-rose-400 text-xs font-mono uppercase tracking-wider">Super Admin</span>
    </div>
    <h1 class="font-display font-bold text-3xl text-white mb-1">Admin Panel</h1>
    <p class="text-ink-400 mb-8">Manage all users, roles, and permissions</p>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8" v-if="usersStore.stats">
      <div v-for="s in statCards" :key="s.label" class="card p-4 text-center col-span-1 sm:col-span-1">
        <p class="text-lg mb-1">{{ s.icon }}</p>
        <p class="font-display font-bold text-xl" :class="s.color">{{ s.value }}</p>
        <p class="text-ink-400 text-xs mt-0.5">{{ s.label }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 p-1 bg-ink-800 border border-ink-700 rounded-xl w-fit">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="px-5 py-2 rounded-lg text-sm font-body font-medium transition-all"
        :class="activeTab === tab.id ? 'bg-accent text-white' : 'text-ink-400 hover:text-white'">
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- USERS TAB -->
    <div v-if="activeTab === 'users'">
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-5">
        <input v-model="userSearch" type="text" placeholder="Search users..." class="input flex-1" @input="debounceUsers" />
        <select v-model="roleFilter" @change="loadUsers" class="input sm:w-36">
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>
        <select v-model="statusFilter" @change="loadUsers" class="input sm:w-36">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <!-- Users table -->
      <div class="card overflow-hidden">
        <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-ink-700 bg-ink-900/50 text-xs font-mono uppercase tracking-wider text-ink-400">
          <div class="col-span-3">User</div>
          <div class="col-span-3">Email</div>
          <div class="col-span-1">Role</div>
          <div class="col-span-1">Status</div>
          <div class="col-span-1">Projects</div>
          <div class="col-span-1">Joined</div>
          <div class="col-span-2 text-right">Actions</div>
        </div>

        <div v-if="usersStore.loading" class="p-8 text-center text-ink-400">Loading users...</div>

        <div v-else-if="!usersStore.users.length" class="p-12 text-center">
          <p class="text-4xl mb-3">👥</p>
          <p class="text-ink-400">No users found</p>
        </div>

        <div v-for="(u, i) in usersStore.users" :key="u._id"
          class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-6 py-4 border-b border-ink-700/40 last:border-0 hover:bg-ink-700/20 transition-colors animate-fade-in"
          :class="{ 'opacity-60': u.status === 'suspended' }"
          :style="{animationDelay: i*15+'ms'}">

          <!-- User -->
          <div class="md:col-span-3 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border"
              :class="u.role==='admin' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : u.role==='teacher' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-accent/20 text-accent border-accent/30'">
              {{ u.name?.[0]?.toUpperCase() }}
            </div>
            <div class="min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ u.name }}</p>
              <p class="text-ink-500 text-xs">{{ u._id === auth.user._id ? '(you)' : '' }}</p>
            </div>
          </div>

          <!-- Email -->
          <div class="md:col-span-3">
            <p class="text-ink-300 text-sm truncate">{{ u.email }}</p>
          </div>

          <!-- Role -->
          <div class="md:col-span-1">
            <span :class="'badge-'+u.role" class="badge capitalize">{{ u.role }}</span>
          </div>

          <!-- Status -->
          <div class="md:col-span-1">
            <span :class="'badge-'+u.status" class="badge">{{ u.status }}</span>
          </div>

          <!-- Projects -->
          <div class="md:col-span-1">
            <span class="text-ink-400 text-sm font-mono">{{ u.projectCount || 0 }}</span>
          </div>

          <!-- Joined -->
          <div class="md:col-span-1">
            <p class="text-ink-500 text-xs">{{ fmtDate(u.createdAt) }}</p>
          </div>

          <!-- Actions -->
          <div class="md:col-span-2 flex items-center gap-1.5 justify-start md:justify-end flex-wrap" v-if="u._id !== auth.user._id">
            <!-- Role dropdown -->
            <select
              :value="u.role"
              @change="changeRole(u, $event.target.value)"
              class="text-xs bg-ink-700 border border-ink-600 text-ink-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-accent transition-colors cursor-pointer hover:bg-ink-600"
              :disabled="actionLoading[u._id]"
              title="Change role">
              <option value="student">🎓 Student</option>
              <option value="teacher">👨‍🏫 Teacher</option>
              <option value="admin">🔐 Admin</option>
            </select>

            <!-- Suspend/Activate -->
            <button v-if="u.status === 'active'" @click="toggleStatus(u, 'suspended')" :disabled="actionLoading[u._id]"
              class="btn-warning text-xs py-1.5 px-2.5" title="Suspend user">⏸</button>
            <button v-else @click="toggleStatus(u, 'active')" :disabled="actionLoading[u._id]"
              class="btn-success text-xs py-1.5 px-2.5" title="Activate user">▶</button>

            <!-- Delete -->
            <button @click="toDeleteUser = u" :disabled="actionLoading[u._id]"
              class="btn-danger text-xs py-1.5 px-2.5" title="Delete user">🗑</button>
          </div>
          <div v-else class="md:col-span-2 text-right">
            <span class="text-ink-600 text-xs font-mono">current user</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PROJECTS TAB -->
    <div v-if="activeTab === 'projects'">
      <div class="flex flex-col sm:flex-row gap-3 mb-5">
        <input v-model="projSearch" type="text" placeholder="Search projects..." class="input flex-1" @input="debounceProjects" />
        <select v-model="projStatus" @change="loadProjects" class="input sm:w-40">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div class="card overflow-hidden">
        <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-ink-700 bg-ink-900/50 text-xs font-mono uppercase tracking-wider text-ink-400">
          <div class="col-span-4">Project</div>
          <div class="col-span-2">Student</div>
          <div class="col-span-2">Date</div>
          <div class="col-span-2">Status</div>
          <div class="col-span-2 text-right">Actions</div>
        </div>

        <div v-if="pStore.loading" class="p-8 text-center text-ink-400">Loading...</div>
        <div v-else-if="!pStore.projects.length" class="p-12 text-center">
          <p class="text-4xl mb-3">📋</p>
          <p class="text-ink-400">No projects found</p>
        </div>

        <div v-for="(p, i) in pStore.projects" :key="p._id"
          class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-6 py-4 border-b border-ink-700/40 last:border-0 hover:bg-ink-700/20 transition-colors animate-fade-in"
          :style="{animationDelay: i*15+'ms'}">
          <div class="md:col-span-4 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-ink-700 border border-ink-600 flex items-center justify-center text-lg flex-shrink-0">{{ projEmoji(p.category) }}</div>
            <div class="min-w-0">
              <p class="font-display font-semibold text-white text-sm truncate">{{ p.title }}</p>
              <p class="text-ink-500 text-xs truncate">{{ p.description?.slice(0,40) }}...</p>
            </div>
          </div>
          <div class="md:col-span-2">
            <p class="text-ink-200 text-sm">{{ p.userId?.name }}</p>
            <span :class="'badge-'+(p.userId?.role||'student')" class="badge text-[10px]">{{ p.userId?.role }}</span>
          </div>
          <div class="md:col-span-2">
            <p class="text-ink-400 text-xs font-mono">{{ fmtDate(p.createdAt) }}</p>
          </div>
          <div class="md:col-span-2">
            <span :class="'badge-'+p.status" class="badge">{{ p.status }}</span>
          </div>
          <div class="md:col-span-2 flex items-center gap-2 justify-start md:justify-end">
            <button v-if="p.status !== 'approved'" @click="setProjStatus(p,'approved')" class="btn-success text-xs py-1.5 px-3">✓</button>
            <button v-if="p.status !== 'rejected'" @click="setProjStatus(p,'rejected')" class="btn-warning text-xs py-1.5 px-3">✕</button>
            <button @click="openEdit(p)" class="btn-secondary text-xs py-1.5 px-3" title="Edit project">✏️</button>
            <button @click="toDeleteProj = p" class="btn-danger text-xs py-1.5 px-3">🗑</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete user dialog -->
    <ConfirmDialog :show="!!toDeleteUser"
      title="Delete User?"
      :message="`Permanently delete ${toDeleteUser?.name}? All their projects will also be deleted.`"
      confirm-text="Delete User" :loading="deleting"
      @confirm="doDeleteUser" @cancel="toDeleteUser = null" />

    <!-- Delete project dialog -->
    <ConfirmDialog :show="!!toDeleteProj"
      title="Delete Project?"
      :message="`Delete &quot;${toDeleteProj?.title}&quot;? This cannot be undone.`"
      confirm-text="Delete" :loading="deleting"
      @confirm="doDeleteProj" @cancel="toDeleteProj = null" />

    <!-- Edit project modal -->
    <Teleport to="body">
      <div v-if="editProject" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="editProject = null">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-lg bg-ink-800 border border-ink-700 rounded-2xl shadow-2xl animate-slide-in">
          <div class="flex items-center justify-between px-6 py-4 border-b border-ink-700">
            <h3 class="font-display font-bold text-lg text-white">Edit Project</h3>
            <button @click="editProject = null" class="text-ink-400 hover:text-white transition-colors text-xl">&times;</button>
          </div>
          <form @submit.prevent="saveEdit" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-ink-200 mb-1">Title</label>
              <input v-model="editForm.title" type="text" class="input" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-ink-200 mb-1">Description</label>
              <textarea v-model="editForm.description" class="input min-h-[80px]" required></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-ink-200 mb-1">Technologies (comma-separated)</label>
              <input v-model="editForm.technologies" type="text" class="input" placeholder="Vue.js, Node.js, MongoDB" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-ink-200 mb-1">Category</label>
                <select v-model="editForm.category" class="input">
                  <option value="web">🌐 Web</option>
                  <option value="mobile">📱 Mobile</option>
                  <option value="ai">🤖 AI</option>
                  <option value="data">📊 Data</option>
                  <option value="game">🎮 Game</option>
                  <option value="other">💡 Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-ink-200 mb-1">Status</label>
                <select v-model="editForm.status" class="input">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-ink-200 mb-1">GitHub URL</label>
              <input v-model="editForm.githubUrl" type="text" class="input" placeholder="https://github.com/..." />
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" @click="editProject = null" class="btn-secondary flex-1 py-2.5">Cancel</button>
              <button type="submit" :disabled="editSaving" class="btn-primary flex-1 py-2.5">{{ editSaving ? 'Saving...' : 'Save Changes' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useUsersStore } from '../stores/users'
import { useProjectsStore } from '../stores/projects'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const usersStore = useUsersStore()
const pStore = useProjectsStore()
const auth = useAuthStore()
const toast = useToast()

const activeTab = ref('users')
const tabs = [
  { id: 'users', icon: '👥', label: 'Users' },
  { id: 'projects', icon: '📁', label: 'Projects' },
]

// User tab state
const userSearch = ref(''), roleFilter = ref('all'), statusFilter = ref('all')
const toDeleteUser = ref(null), deleting = ref(false)
const actionLoading = reactive({})
let userTimer = null, projTimer = null

// Project tab state
const projSearch = ref(''), projStatus = ref('')
const toDeleteProj = ref(null)
const editProject = ref(null)
const editForm = reactive({ title: '', description: '', technologies: '', category: 'other', githubUrl: '', status: 'pending' })
const editSaving = ref(false)

const statCards = computed(() => {
  const s = usersStore.stats
  if (!s) return []
  return [
    { icon:'👥', label:'Total Users', value: s.totalUsers, color:'text-white' },
    { icon:'🎓', label:'Students', value: s.students, color:'text-accent-light' },
    { icon:'👨‍🏫', label:'Teachers', value: s.teachers, color:'text-amber-400' },
    { icon:'🔐', label:'Admins', value: s.admins, color:'text-rose-400' },
    { icon:'⏸', label:'Suspended', value: s.suspended, color:'text-rose-300' },
    { icon:'📁', label:'Projects', value: s.totalProjects, color:'text-white' },
    { icon:'⏳', label:'Pending', value: s.pendingProjects, color:'text-amber-400' },
    { icon:'✅', label:'Approved', value: s.approvedProjects, color:'text-emerald-400' },
  ]
})

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : ''
const projEmoji = c => ({ web:'🌐', mobile:'📱', ai:'🤖', data:'📊', game:'🎮', other:'💡' })[c] || '💡'

const loadUsers = () => {
  const p = {}
  if (roleFilter.value !== 'all') p.role = roleFilter.value
  if (statusFilter.value !== 'all') p.status = statusFilter.value
  if (userSearch.value.trim()) p.search = userSearch.value.trim()
  usersStore.fetchUsers(p)
}
const debounceUsers = () => { clearTimeout(userTimer); userTimer = setTimeout(loadUsers, 350) }

const loadProjects = () => {
  const p = {}
  if (projStatus.value) p.status = projStatus.value
  if (projSearch.value.trim()) p.search = projSearch.value.trim()
  pStore.fetchProjects(p)
}
const debounceProjects = () => { clearTimeout(projTimer); projTimer = setTimeout(loadProjects, 350) }

const changeRole = async (u, role) => {
  if (role === u.role) return
  actionLoading[u._id] = true
  const res = await usersStore.updateRole(u._id, role)
  delete actionLoading[u._id]
  if (res.success) { toast.success(`${u.name} is now a ${role}`); usersStore.fetchStats() }
  else toast.error(res.message)
}

const toggleStatus = async (u, status) => {
  actionLoading[u._id] = true
  const res = await usersStore.updateStatus(u._id, status)
  delete actionLoading[u._id]
  if (res.success) toast.success(`${u.name} ${status}`)
  else toast.error(res.message)
}

const doDeleteUser = async () => {
  deleting.value = true
  const res = await usersStore.deleteUser(toDeleteUser.value._id)
  deleting.value = false
  if (res.success) { toast.success('User deleted'); toDeleteUser.value = null; usersStore.fetchStats() }
  else toast.error(res.message)
}

const setProjStatus = async (p, s) => {
  const res = await pStore.updateStatus(p._id, s)
  if (res.success) toast.success(`Project ${s}`)
  else toast.error(res.message)
}

const doDeleteProj = async () => {
  deleting.value = true
  const res = await pStore.deleteProject(toDeleteProj.value._id)
  deleting.value = false
  if (res.success) { toast.success('Project deleted'); toDeleteProj.value = null }
  else toast.error(res.message)
}

const openEdit = (p) => {
  editProject.value = p
  editForm.title = p.title || ''
  editForm.description = p.description || ''
  editForm.technologies = (p.technologies || []).join(', ')
  editForm.category = p.category || 'other'
  editForm.githubUrl = p.githubUrl || ''
  editForm.status = p.status || 'pending'
}

const saveEdit = async () => {
  editSaving.value = true
  const payload = {
    title: editForm.title,
    description: editForm.description,
    technologies: editForm.technologies.split(',').map(t => t.trim()).filter(Boolean),
    category: editForm.category,
    githubUrl: editForm.githubUrl,
  }
  const res = await pStore.updateProject(editProject.value._id, payload)
  if (res.success) {
    // Also update status if changed
    if (editForm.status !== editProject.value.status) {
      await pStore.updateStatus(editProject.value._id, editForm.status)
    }
    toast.success('Project updated!')
    editProject.value = null
  } else {
    toast.error(res.message)
  }
  editSaving.value = false
}

onMounted(() => {
  loadUsers()
  loadProjects()
  usersStore.fetchStats()
})
</script>
