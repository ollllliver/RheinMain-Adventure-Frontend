import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import LobbyView from '@/views/LobbyView.vue'

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
    path: '/instructions',
    name: 'Instructions',
    component: () => import('../views/Instructions.vue')
  },
  {
    path: '/uebersicht',
    name: 'Lobbyuebersicht',
    component: () => import('../views/LobbyuebersichtView.vue')
  },
  {
    path: '/lobby/:lobby_id',
    name: 'LobbyView',
    component: LobbyView,
    props:true
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
