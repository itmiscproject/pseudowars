import { createRouter, createWebHistory } from 'vue-router'
import PseudoWarsGame from '../components/PseudoWarsGame.vue'
import Test from '../components/Test.vue'

const routes = [
  { path: '/', component: PseudoWarsGame },
  { path: '/Test', component: Test }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
