import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home.vue'
import LobbyView from '@/views/LobbyView.vue'
import Register from "@/views/Register.vue";
import LobbyuebersichtView from "@/views/LobbyuebersichtView.vue";
import Editor from "@/views/Editor.vue";
import AboutView from "@/views/AboutView.vue";
import userStore from '@/stores/user'
import Landingpage from '@views/Landingpage.vue';

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
        path: '/landingpage',
        name: 'Landingpage',
        component: () => import('../views/Landingpage.vue')
    },
    

    {
        path: '/uebersicht',
        name: 'Lobbyuebersicht',
        component: LobbyuebersichtView,
        beforeEnter: (to, from, next) => {
            if (!userStore.state.istEingeloggt){
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
        component: () => import('../views/Environment.vue')
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
    },

    {
        path: '/about',
        name: 'About',
        component: AboutView
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
