import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home.vue'
import LobbyView from '@/views/LobbyView.vue'
import Register from "@/views/Register.vue";
import LogInView from "@/views/LogInView.vue";
import Instructions from "@/views/Instructions.vue";
import LobbyuebersichtView from "@/views/LobbyuebersichtView.vue";
import Editor from "@/views/Editor.vue";
import AboutView from "@/views/AboutView.vue";
import userStore from '@/stores/user'
import Landingpage from '@views/Landingpage.vue';

// Routen der Anwendung

// ziellobby wird befüllt, wenn man per einladungslink einer Lobby beitreten will, aber man ist noch nicht angemeldet.
// nach anmelden wird man, wenn ziellobby befüllt ist, zu der ziellobby weitergeleitet.
let zielLobby = '';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'Home',
        component: Home,
        beforeEnter: (to, from, next) => {
            if (zielLobby != ''){
                next(zielLobby);
                zielLobby = '';
            }else{
                next();
            }
        }
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: Register
    },
    {
        path: '/login',
        name: 'LogInView',
        component: LogInView
    },
    {
        path: '/instructions',
        name: 'Instructions',
        component: Instructions
    },

    {
        path: '/',
        name: 'Landingpage',
        component: () => import('../views/Landingpage.vue'),
        beforeEnter: (to, from, next) => {
            if (userStore.state.istEingeloggt){
                next('/home');
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
                next('/');
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
                zielLobby = to.path;
                next('/login');
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
        path: '/editoruebersicht',
        name: 'Editoruebersicht',
        component: () => import('../views/Editoruebersicht.vue')
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
