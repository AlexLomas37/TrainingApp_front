import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DisciplinesView from '../views/Disciplines/DisciplinesView.vue'
import DisciplineView from '../views/Disciplines/DisciplineView.vue'
import TrainingView from '../views/TrainingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/disciplines',
      name: 'disciplines',
      component: DisciplinesView,
    },
    {
      path: '/discipline/:id',
      name: 'discipline',
      component: DisciplineView,
      props: true
    },
    {
      path: '/training/:id',
      name: 'disciplineTrainings',
      component: TrainingView
    }
  ],
})

export default router
