import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: () => import('../views/LandingView.vue'), meta: { guest: true } },
  { path: '/login', component: () => import('../views/LoginView.vue'), meta: { guest: true } },
  { path: '/register', component: () => import('../views/RegisterView.vue'), meta: { guest: true } },
  { path: '/projects', component: () => import('../views/ProjectsView.vue'), meta: { requiresAuth: true } },
  { path: '/projects/new', component: () => import('../views/NewProjectView.vue'), meta: { requiresAuth: true } },
  { path: '/projects/:id', name: 'project-detail', component: () => import('../views/ProjectDetailView.vue'), meta: { requiresAuth: true } },
  { path: '/profile', component: () => import('../views/ProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/teacher', component: () => import('../views/TeacherView.vue'), meta: { requiresAuth: true, role: 'teacher' } },
  { path: '/admin', component: () => import('../views/AdminView.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/:pathMatch(.*)*', redirect: '/projects' }
]

const router = createRouter({ history: createWebHistory(), routes, scrollBehavior: () => ({ top: 0 }) })

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return next('/login')
  if (to.meta.guest && auth.isAuthenticated) return next('/projects')
  if (to.meta.role === 'admin' && !auth.isAdmin) return next('/projects')
  if (to.meta.role === 'teacher' && !auth.isTeacher) return next('/projects')
  next()
})

export default router
