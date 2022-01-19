<!-- Home View mit Login/Regestrieren Formular -->

<template>
  <div v-if="!userStore.getters.istEingeloggt" class="d-grid gap-2 col-6 mx-auto">
    <Login />
  </div>
  <div v-else class="text-center">
    <h2>Welcome, {{ userStore.state.benutzername }}</h2>
    <button class="btn btn-default" @click="$router.push('uebersicht')">
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
    </button>
    
    <button class="btn btn-default" @click="$router.push('instructions')">
      Anleitung
    </button>
    <br>

    <button class="btn btn-danger" @click="userStore.logout()">
      Logout
    </button>
  </div> 
  <!-- <Login /> -->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref} from 'vue';
import userStore from '@/stores/user'
import { useLoginStore } from "@/stores/LoginStore";
import Login from '@/components/Login.vue'
import { useRouter } from "vue-router";
export default defineComponent({
  name: 'Home',
  components: { Login },
  setup() {

    onMounted(userStore.getUser)
    return { userStore }
    // const {loginstate, errormessage, doLogin, doLogout} = useLoginStore();
    //     onMounted(()=>{
    //         console.log("deine Mudda")
    //         doLogout();
    //     })
    //     const router = useRouter();
    //     const username = ref("friedfert");
    //     const password = ref("dingdong");
    //     async function login(){
    //         console.log("username:", username.value);
    //         console.log("password:", password.value);
    //         const post = await doLogin(username.value, password.value);
    //         if (post){
    //             router.push("/");
    //         }

    //     }

    //     return {
    //         login,
    //         username,
    //         password,
    //         errormessage: ref(errormessage),
    //     }
  }
});
</script>

<style scoped>

</style>
