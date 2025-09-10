import { createRouter, createWebHistory } from 'vue-router'

// Qui carichi le tue viste/pagine
import Home from '@/views/Home.vue'
import Admin from '@/views/Admin.vue'
import Results from '@/views/Results.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/results', name: 'Results', component: Results },
  { path: '/admin', name: 'Admin', component: Admin },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
