import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import EditoruebersichtView from '@/views/EditoruebersichtView.vue';
import LobbyuebersichtView from "@/views/LobbyuebersichtView.vue";
import SpieleUmgebungView from '@/views/SpieleUmgebungView.vue';
import RegistrierenView from "@/views/RegistrierenView.vue";
import LandingpageView from '@/views/LandingpageView.vue';
import AnleitungView from '@/views/AnleitungView.vue';
import AboutView from "@/views/UeberUnsView.vue";
import EditorView from "@/views/EditorView.vue";
import MenueView from '@/views/MenueView.vue'
import LobbyView from '@/views/LobbyView.vue'
import LoginView from "@/views/LoginView.vue";
import userStore from '@/stores/user'

// Routen der Anwendung

let zielLobby = "";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Landingpage',
        component: LandingpageView,
        beforeEnter: (to, from, next) => {
            if (zielLobby!=""){
                next(zielLobby);
                zielLobby="";
            }else{
                next();
            }
        }
    },
    {
        path: '/home',
        name: 'MenueView',
        component: MenueView,
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
        path: '/lobby/:lobby_id',
        name: 'LobbyView',
        component: LobbyView,
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
        path: '/editoruebersicht',
        name: 'Editoruebersicht',
        component: EditoruebersichtView,
        beforeEnter: (to, from, next) => {
            if (!userStore.state.istEingeloggt){
                next('/');
            }else{
                next();
            }
        }
    },
    {
        path: '/editor',
        name: 'Editor',
        component: EditorView,
        beforeEnter: (to, from, next) => {
            if (!userStore.state.istEingeloggt){
                next('/');
            }else{
                next();
            }
        }
    },
    {
        path: '/environment',
        name: 'Environment',
        component: SpieleUmgebungView,
        beforeEnter: (to, from, next) => {
            if (!userStore.state.istEingeloggt){
                next('/');
            }else{
                next();
            }
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: RegistrierenView
    },
    {
        path: '/anleitung',
        name: 'AnleitungView',
        component: AnleitungView
    },
    {
        path: '/about',
        name: 'About',
        component: AboutView
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
