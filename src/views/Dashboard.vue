
<template>
   
    <!-- <h2>Welcome, {{ userStore.state.benutzername }}</h2> -->
    <!-- <button class="btn btn-default" @click="$router.push('uebersicht')">
      Lobbyübersicht
    </button>
    <button class="btn btn-default" @click="$router.push('create')">
      Create Lobby
    </button>
    <button class="btn btn-default" @click="$router.push('environment')">
      Game Environment
    </button>
    <button class="btn btn-default" @click="$router.push('editor')">
      Level Editor
    </button> -->
    <button class="btn btn-default" @click="showList">
      Userliste
    </button>
    
    <!-- <button class="btn btn-default" @click="$router.push('instructions')">
      Anleitung
    </button>
    <br>
    
    <button class="btn btn-danger" @click="userStore.logout()">
      Logout
    </button> -->
  
</template>

<script lang="ts">
import { defineComponent, onMounted, ref} from 'vue';
// import userStore from '@/stores/user'
import { useLoginStore } from "@/stores/LoginStore";
import { useRouter } from "vue-router";
import axios from 'axios';
export default defineComponent({
  name: 'Home',
  components: { },
  methods: {
      showList: () => {
          // request promise
          // anzeigen liste
          
          axios.get('/api/benutzer').then(response => {
              console.log(response.data);
          }).catch(response => {console.log("FIGGN")});

      }
  },
  setup() {
    // onMounted(userStore.getUser)
    // return { userStore }
    const {loginstate, errormessage, doLogin, doLogout} = useLoginStore();
        onMounted(()=>{
            console.log("deine Mudda")
            doLogout();
        })
        const router = useRouter();
        const username = ref("friedfert");
        const password = ref("dingdong");
        // async function login(){
        //     console.log("username:", username.value);
        //     console.log("password:", password.value);
        //     const post = await doLogin(username.value, password.value);
        //     if (post){
        //         router.push("/");
        //     }

        // }

        return {
            //login,
            username,
            password,
            errormessage: ref(errormessage),
        }
  }
});
</script>