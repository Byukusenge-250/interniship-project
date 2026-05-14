<template>
  <div class="landing-page min-h-screen bg-ink-900 text-white overflow-hidden selection:bg-accent selection:text-white">

    <!-- ═══════════ NAVBAR ═══════════ -->
    <nav class="fixed top-0 w-full bg-ink-900/70 backdrop-blur-xl border-b border-white/5 z-50 transition-all duration-300" :class="scrolled ? 'shadow-lg shadow-black/20' : ''">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-accent to-violet-500 rounded-xl flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.5)]">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
          </div>
          <span class="font-display font-bold text-xl tracking-tight">StudentForge</span>
        </div>
        <div class="hidden md:flex items-center gap-8 text-sm text-ink-300">
          <a href="#features" class="hover:text-white transition-colors">Features</a>
          <a href="#how" class="hover:text-white transition-colors">How It Works</a>
          <a href="#testimonials" class="hover:text-white transition-colors">Testimonials</a>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink to="/login" class="text-sm font-medium text-ink-300 hover:text-white transition-colors px-4 py-2">Sign In</RouterLink>
          <RouterLink to="/register" class="text-sm font-bold bg-white text-ink-900 px-5 py-2.5 rounded-full hover:bg-ink-100 transition-all hover:scale-105 active:scale-95 shadow-lg">Get Started</RouterLink>
        </div>
      </div>
    </nav>

    <!-- ═══════════ HERO ═══════════ -->
    <section class="relative pt-36 pb-24 lg:pt-52 lg:pb-40 px-6">
      <!-- Animated BG blobs -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
        <!-- Grid pattern -->
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
      </div>

      <div class="relative max-w-5xl mx-auto text-center hero-content">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-sm font-medium mb-8">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-light opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-accent-light"></span>
          </span>
          🎉 Now open for all universities
        </div>

        <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-8">
          Where Students
          <span class="relative inline-block">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-accent-light via-violet-400 to-fuchsia-400">Build</span>
            <svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none"><path d="M2 8c40-6 80-6 120-2s56 4 76 0" stroke="url(#grad)" stroke-width="3" stroke-linecap="round"/><defs><linearGradient id="grad"><stop stop-color="#818cf8"/><stop offset="1" stop-color="#c084fc"/></linearGradient></defs></svg>
          </span>
          ,<br class="hidden sm:block"/>
          Showcase &amp; <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Succeed</span>
        </h1>

        <p class="text-lg lg:text-xl text-ink-400 max-w-2xl mx-auto leading-relaxed mb-12">
          The all-in-one academic portal for submitting projects, getting teacher feedback, and tracking your progress — beautifully designed for the modern campus.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <RouterLink to="/register" class="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent to-violet-500 text-white rounded-full font-bold text-lg shadow-[0_4px_30px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_50px_rgba(99,102,241,0.6)] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2">
            Get Started Free
            <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
          </RouterLink>
          <a href="#features" class="w-full sm:w-auto px-8 py-4 bg-ink-800/80 hover:bg-ink-700 text-white rounded-full font-bold text-lg border border-white/10 transition-all hover:-translate-y-0.5">
            See How It Works
          </a>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="relative max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="s in stats" :key="s.label" class="text-center p-6 rounded-2xl bg-ink-800/40 backdrop-blur border border-white/5">
          <div class="text-3xl lg:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-ink-300">{{ s.value }}</div>
          <div class="text-xs text-ink-400 mt-1 font-medium uppercase tracking-wider">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- ═══════════ FEATURES ═══════════ -->
    <section id="features" class="relative py-28 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-accent text-sm font-bold uppercase tracking-widest">Features</span>
          <h2 class="font-display text-4xl lg:text-5xl font-extrabold mt-3">Everything You Need</h2>
          <p class="text-ink-400 mt-4 max-w-xl mx-auto">A complete toolkit for students, teachers, and admins to manage the academic project lifecycle.</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="f in features" :key="f.title" class="group p-8 rounded-3xl bg-ink-800/40 border border-white/5 hover:border-accent/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-3xl transition-transform duration-300 group-hover:scale-110" :class="f.bg">{{ f.icon }}</div>
            <h3 class="text-xl font-bold font-display mb-2">{{ f.title }}</h3>
            <p class="text-ink-400 leading-relaxed text-sm">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ FEATURED PROJECTS ═══════════ -->
    <section class="relative py-28 px-6 bg-ink-800/30">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-cyan-400 text-sm font-bold uppercase tracking-widest">Showcase</span>
          <h2 class="font-display text-4xl lg:text-5xl font-extrabold mt-3">Featured Projects</h2>
          <p class="text-ink-400 mt-4 max-w-xl mx-auto">Check out some of the amazing projects submitted by our students.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="proj in projects" :key="proj.title" class="group rounded-3xl bg-ink-800/60 border border-white/5 overflow-hidden hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
            <!-- Project Color Header -->
            <div class="h-40 relative overflow-hidden" :class="proj.gradient">
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-6xl opacity-80">{{ proj.emoji }}</span>
              </div>
              <!-- Status badge -->
              <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border" :class="proj.statusClass">{{ proj.status }}</div>
            </div>
            <!-- Project Info -->
            <div class="p-6">
              <h3 class="text-lg font-display font-bold mb-2 group-hover:text-accent-light transition-colors">{{ proj.title }}</h3>
              <p class="text-ink-400 text-sm leading-relaxed mb-4">{{ proj.desc }}</p>
              <!-- Tech tags -->
              <div class="flex flex-wrap gap-2 mb-5">
                <span v-for="t in proj.tech" :key="t" class="px-2.5 py-1 bg-ink-700/80 text-ink-300 text-xs rounded-lg font-mono border border-white/5">{{ t }}</span>
              </div>
              <!-- Author -->
              <div class="flex items-center gap-3 pt-4 border-t border-white/5">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" :class="proj.authorBg">{{ proj.author[0] }}</div>
                <div>
                  <div class="text-sm font-medium">{{ proj.author }}</div>
                  <div class="text-xs text-ink-500">{{ proj.role }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ HOW IT WORKS ═══════════ -->
    <section id="how" class="relative py-28 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-emerald-400 text-sm font-bold uppercase tracking-widest">How It Works</span>
          <h2 class="font-display text-4xl lg:text-5xl font-extrabold mt-3">Simple as 1-2-3</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(step, i) in steps" :key="i" class="relative text-center p-8">
            <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center text-2xl font-display font-extrabold shadow-lg shadow-accent/30 mb-6">{{ i + 1 }}</div>
            <h3 class="text-lg font-bold font-display mb-2">{{ step.title }}</h3>
            <p class="text-ink-400 text-sm leading-relaxed">{{ step.desc }}</p>
            <!-- Connector line -->
            <div v-if="i < 2" class="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-ink-600"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ ROLE CARDS ═══════════ -->
    <section class="relative py-28 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-amber-400 text-sm font-bold uppercase tracking-widest">For Everyone</span>
          <h2 class="font-display text-4xl lg:text-5xl font-extrabold mt-3">Built for Every Role</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="r in roles" :key="r.title" class="rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1" :class="r.border">
            <div class="text-5xl mb-6">{{ r.icon }}</div>
            <h3 class="text-2xl font-display font-bold mb-3">{{ r.title }}</h3>
            <ul class="space-y-3">
              <li v-for="p in r.perks" :key="p" class="flex items-start gap-2 text-sm text-ink-300">
                <svg class="w-5 h-5 mt-0.5 shrink-0" :class="r.check" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                {{ p }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ TESTIMONIALS ═══════════ -->
    <section id="testimonials" class="relative py-28 px-6 bg-ink-800/30">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-fuchsia-400 text-sm font-bold uppercase tracking-widest">Testimonials</span>
          <h2 class="font-display text-4xl lg:text-5xl font-extrabold mt-3">Loved by Students &amp; Teachers</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="t in testimonials" :key="t.name" class="p-8 rounded-3xl bg-ink-800/50 border border-white/5 backdrop-blur-sm">
            <div class="flex gap-1 mb-4">
              <svg v-for="n in 5" :key="n" class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-ink-300 text-sm leading-relaxed italic mb-6">"{{ t.quote }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" :class="t.bg">{{ t.name[0] }}</div>
              <div>
                <div class="text-sm font-bold">{{ t.name }}</div>
                <div class="text-xs text-ink-500">{{ t.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ CTA ═══════════ -->
    <section class="relative py-28 px-6">
      <div class="max-w-3xl mx-auto text-center">
        <div class="p-12 md:p-16 rounded-[2rem] bg-gradient-to-br from-accent/20 via-violet-500/10 to-fuchsia-500/10 border border-accent/20 backdrop-blur-xl">
          <h2 class="font-display text-4xl lg:text-5xl font-extrabold mb-4">Ready to Get Started?</h2>
          <p class="text-ink-400 mb-10 max-w-lg mx-auto">Join thousands of students already showcasing their best work. It's free, fast, and beautiful.</p>
          <RouterLink to="/register" class="inline-flex items-center gap-2 px-10 py-4 bg-white text-ink-900 rounded-full font-bold text-lg hover:bg-ink-100 transition-all hover:scale-105 active:scale-95 shadow-xl">
            Create Your Account
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ═══════════ FOOTER ═══════════ -->
    <footer class="border-t border-white/5 py-12 px-6">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-br from-accent to-violet-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
          </div>
          <span class="font-display font-bold">StudentForge</span>
        </div>
        <p class="text-ink-500 text-sm">&copy; {{ new Date().getFullYear() }} StudentForge. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const scrolled = ref(false)
const onScroll = () => { scrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const stats = [
  { value: '2,500+', label: 'Students' },
  { value: '180+', label: 'Projects' },
  { value: '45+', label: 'Teachers' },
  { value: '98%', label: 'Satisfaction' },
]

const features = [
  { icon: '🚀', title: 'Project Showcase', desc: 'Submit and display your projects with rich descriptions, tech stacks, and GitHub links.', bg: 'bg-accent/10' },
  { icon: '📝', title: 'Teacher Reviews', desc: 'Teachers approve, reject, or request changes with detailed feedback on every project.', bg: 'bg-amber-500/10' },
  { icon: '📊', title: 'Admin Dashboard', desc: 'Full control panel for managing users, monitoring activity, and overseeing all projects.', bg: 'bg-emerald-500/10' },
  { icon: '🔒', title: 'Role-Based Access', desc: 'Secure authentication with distinct permissions for students, teachers, and admins.', bg: 'bg-rose-500/10' },
  { icon: '🎨', title: 'Beautiful Interface', desc: 'Dark-themed, responsive design that looks incredible on every device and screen size.', bg: 'bg-violet-500/10' },
  { icon: '⚡', title: 'Real-Time Updates', desc: 'Instant notifications when your project status changes or you receive new feedback.', bg: 'bg-cyan-500/10' },
]

const steps = [
  { title: 'Create Your Account', desc: 'Sign up as a student, teacher, or admin in just a few seconds — no credit card required.' },
  { title: 'Submit Your Project', desc: 'Add your project details, technologies used, and GitHub link for teacher review.' },
  { title: 'Get Feedback & Grow', desc: 'Receive teacher approval and feedback. Track your portfolio as it grows.' },
]

const roles = [
  { title: 'Students', icon: '🎓', border: 'border-accent/20 bg-accent/5', check: 'text-accent-light',
    perks: ['Submit unlimited projects', 'Track approval status', 'Build a public portfolio', 'Receive teacher feedback'] },
  { title: 'Teachers', icon: '👨‍🏫', border: 'border-amber-500/20 bg-amber-500/5', check: 'text-amber-400',
    perks: ['Review student projects', 'Approve or reject submissions', 'Provide detailed feedback', 'Monitor class progress'] },
  { title: 'Admins', icon: '🔐', border: 'border-rose-500/20 bg-rose-500/5', check: 'text-rose-400',
    perks: ['Manage all users & roles', 'Full project oversight', 'Platform analytics', 'Suspend or activate accounts'] },
]

const testimonials = [
  { name: 'Alex Chen', role: 'Computer Science Student', quote: 'StudentForge completely changed how I present my work. My portfolio helped me land an internship!', bg: 'bg-accent/20 text-accent-light' },
  { name: 'Prof. Sarah Johnson', role: 'Software Engineering Teacher', quote: 'Reviewing student projects has never been easier. The interface is clean and the workflow is seamless.', bg: 'bg-amber-500/20 text-amber-400' },
  { name: 'Maria Silva', role: 'Data Science Student', quote: 'I love the dark theme and the smooth animations. It feels like a professional-grade tool, not a school app.', bg: 'bg-emerald-500/20 text-emerald-400' },
]

const projects = [
  {
    title: 'Vue.js E-Commerce Platform',
    desc: 'Full-featured e-commerce with cart, checkout, and admin panel built with modern web technologies.',
    tech: ['Vue.js', 'Node.js', 'MongoDB', 'Stripe'],
    emoji: '🛒',
    gradient: 'bg-gradient-to-br from-accent/30 to-violet-600/30',
    status: 'Approved',
    statusClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    author: 'Alex Chen',
    role: 'Computer Science Student',
    authorBg: 'bg-accent/20 text-accent-light'
  },
  {
    title: 'AI Study Assistant',
    desc: 'AI-powered study assistant that generates flashcards and quizzes from uploaded PDF documents.',
    tech: ['Python', 'FastAPI', 'React', 'OpenAI'],
    emoji: '🤖',
    gradient: 'bg-gradient-to-br from-fuchsia-500/30 to-rose-500/30',
    status: 'Approved',
    statusClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    author: 'Maria Silva',
    role: 'Data Science Student',
    authorBg: 'bg-emerald-500/20 text-emerald-400'
  },
  {
    title: 'Campus Food Delivery',
    desc: 'Mobile app connecting students with campus cafeterias for quick ordering and delivery tracking.',
    tech: ['React Native', 'Node.js', 'Firebase'],
    emoji: '🍔',
    gradient: 'bg-gradient-to-br from-amber-500/30 to-orange-500/30',
    status: 'Pending',
    statusClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    author: 'James Okonkwo',
    role: 'Software Engineering Student',
    authorBg: 'bg-amber-500/20 text-amber-400'
  },
]
</script>

<style scoped>
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 8s ease-in-out infinite;
}
.blob-1 {
  width: 500px; height: 500px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  top: 5%; left: 15%;
}
.blob-2 {
  width: 400px; height: 400px;
  background: linear-gradient(135deg, #8b5cf6, #d946ef);
  top: 20%; right: 10%;
  animation-delay: -3s;
}
.blob-3 {
  width: 350px; height: 350px;
  background: linear-gradient(135deg, #06b6d4, #6366f1);
  bottom: 10%; left: 40%;
  animation-delay: -5s;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
.hero-content {
  animation: heroIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes heroIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
