import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home.vue'
import LobbyView from '@/views/LobbyView.vue'
import Register from "@/views/Register.vue";
import LobbyuebersichtView from "@/views/LobbyuebersichtView.vue";
import Editor from "@/views/Editor.vue";

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
        component: Register
    },

    {
        path: '/instructions',
        name: 'Instructions',
        component: () => import('../views/Instructions.vue')
    },

    {
        path: '/uebersicht',
        name: 'Lobbyuebersicht',
        component: LobbyuebersichtView
    },

    {
        path: '/lobby/:lobby_id',
        name: 'LobbyView',
        component: LobbyView,
        props: true
    },
    {
        path: '/environment',
        name: 'Environment',
        component: () => import('../views/Environment.vue')
    },
    {
        path: '/editor',
        name: 'Editor',
        component: Editor
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
