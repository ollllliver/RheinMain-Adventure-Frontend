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
import userStore from '@/stores/user'

// Routen der Anwendung

const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'Home',
        component: MenueView
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: RegistrierenView
    },
    {
        path: '/instructions',
        name: 'AnleitungView',
        component: AnleitungView,
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
        path: '/',
        name: 'Landingpage',
        component: LandingpageView
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
        component: SpieleUmgebungView,
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
        component: EditorView,
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
        component: EditoruebersichtView
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
