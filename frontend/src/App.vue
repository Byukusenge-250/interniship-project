<template>
  <div class="min-h-screen bg-ink-900">
    <NavBar v-if="auth.isAuthenticated" />
    <main :class="auth.isAuthenticated ? 'pt-16' : ''">
      <RouterView />
    </main>
    <ToastContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
onMounted(() => { if (auth.isAuthenticated) auth.fetchMe() })
</script>
