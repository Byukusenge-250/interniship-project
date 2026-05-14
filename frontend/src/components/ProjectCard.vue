<template>
  <div class="card hover:border-ink-500 transition-all duration-200 flex flex-col animate-fade-in">
    <div class="h-36 bg-gradient-to-br from-ink-700 to-ink-900 relative flex items-center justify-center rounded-t-xl overflow-hidden">
      <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title" class="w-full h-full object-cover" @error="e => e.target.style.display='none'" />
      <span v-else class="text-5xl">{{ emoji }}</span>
      <div class="absolute top-2 right-2"><span :class="'badge-' + project.status" class="badge">{{ project.status }}</span></div>
      <div class="absolute top-2 left-2"><span class="badge bg-ink-900/80 text-ink-300 border-ink-600/50 text-[10px] uppercase tracking-wider">{{ project.category }}</span></div>
    </div>
    <div class="p-4 flex flex-col flex-1">
      <RouterLink :to="'/projects/' + project._id" class="font-display font-bold text-white truncate hover:text-accent-light transition-colors block">{{ project.title }}</RouterLink>
      <div class="flex items-center gap-2 mt-1.5">
        <div class="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-[9px] text-accent font-bold">{{ project.userId?.name?.[0]?.toUpperCase() }}</div>
        <span class="text-ink-400 text-xs">{{ project.userId?.name || 'Unknown' }}</span>
        <span :class="'badge-' + (project.userId?.role || 'student')" class="badge text-[10px] ml-auto">{{ project.userId?.role || 'student' }}</span>
      </div>
      <p class="text-ink-400 text-sm mt-2 line-clamp-2 flex-1">{{ project.description }}</p>
      <div class="flex flex-wrap gap-1 mt-3">
        <span v-for="t in project.technologies?.slice(0,3)" :key="t" class="text-[11px] font-mono px-2 py-0.5 bg-accent/10 text-accent-light rounded border border-accent/20">{{ t }}</span>
        <span v-if="project.technologies?.length > 3" class="text-[11px] font-mono px-2 py-0.5 bg-ink-700 text-ink-400 rounded">+{{ project.technologies.length - 3 }}</span>
      </div>
      <div class="flex items-center gap-2 mt-3 pt-3 border-t border-ink-700">
        <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="text-xs text-ink-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-ink-700">⬡ GitHub</a>
        <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="text-xs text-ink-400 hover:text-emerald-400 transition-colors px-2 py-1 rounded hover:bg-ink-700">↗ Live</a>
        <span class="text-ink-600 text-xs ml-auto">{{ fmtDate(project.createdAt) }}</span>
      </div>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
const props = defineProps({ project: Object })
const emoji = computed(() => ({ web:'🌐', mobile:'📱', ai:'🤖', data:'📊', game:'🎮', other:'💡' })[props.project.category] || '💡')
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : ''
</script>
