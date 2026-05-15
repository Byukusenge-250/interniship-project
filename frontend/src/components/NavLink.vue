<template>
  <RouterLink :to="to"
    class="px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-150"
    :class="route.path === to ? 'text-white bg-ink-700' : 'text-ink-300 hover:text-white hover:bg-ink-700'">
    <slot />
  </RouterLink>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
defineProps({ to: String })
const route = useRoute()
</script>
