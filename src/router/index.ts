import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

// Routen der Anwendung

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../views/Create.vue')
  },
  {
    path: '/join',
    name: 'Join',
    component: () => import('../views/Join.vue')
  },
  {
    path: '/editoruebersicht',
    name: 'Editoruebersicht',
    component: () => import('../views/Editoruebersicht.vue')
  },

  {
    path: '/editor',
    name: 'Editor',
    component: () => import('../views/Editor.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
