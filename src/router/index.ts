import {createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home.vue'
import LobbyView from '@/views/LobbyView.vue'
import Register from "@/views/Register.vue";
import LobbyuebersichtView from "@/views/LobbyuebersichtView.vue";
import Editor from "@/views/Editor.vue";
import userStore from '@/stores/user'
import { logout } from '@/requests';

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
        component: () => import('../views/Instructions.vue'),
        beforeEnter: (to, from, next) => {
            if (!userStore.state.istEingeloggt){
                console.log(from);
                console.log(to);
                next('/')
            }else{
                next();
            }
        }
    },

    {
        path: '/uebersicht',
        name: 'Lobbyuebersicht',
        component: LobbyuebersichtView,
        beforeEnter: (to, from, next) => {
            if (!userStore.state.istEingeloggt){
                console.log(from);
                console.log(to);
                next('/')
            }else{
                next();
            }
        }
    },

    {
        path: '/lobby/:lobby_id',
        name: 'LobbyView',
        component: LobbyView,
        props: true,
        beforeEnter: (to, from, next) => {
            if (!userStore.state.istEingeloggt){
                console.log(from);
                console.log(to);
                next('/')
            }else{
                next();
            }
        }
    },
    {
        path: '/environment',
        name: 'Environment',
        component: () => import('../views/Environment.vue'),
        beforeEnter: (to, from, next) => {
            if (!userStore.state.istEingeloggt){
                console.log(from);
                console.log(to);
                next('/')
            }else{
                next();
            }
        }
    },
    {
        path: '/editor',
        name: 'Editor',
        component: Editor,
        beforeEnter: (to, from, next) => {
            if (!userStore.state.istEingeloggt){
                console.log(from);
                console.log(to);
                next('/')
            }else{
                next();
            }
        }
    }
]

const router = createRouter({
    //history: createWebHistory(),
    history: createWebHashHistory(),
    routes
})

export default router
