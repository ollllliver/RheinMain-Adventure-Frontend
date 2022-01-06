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
    <!-- Wechsel zum "Anleitungs"-Fenster -->
    <button class="btn btn-default" @click="$router.push('instructions')">
      Anleitung
    </button>
    <button class="btn btn-warning" @click="senden">
      TROMP TEST
    </button>
    <br>
    <!-- Logout Button - Wechsel zum "Home"-Fenster -->
    <button class="btn btn-danger" @click="userStore.logout()">
      Logout
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { SpielerLokal } from '@/components/models/SpielerLokal';
import userStore from '@/stores/user'
import Login from '@/components/Login.vue'
export default defineComponent({
  name: 'Home',
  components: { Login },
  setup() {
    onMounted(userStore.getUser)
  
    const spieler = new SpielerLokal;
    function senden(){
      spieler.sendeTest();
    }

    return { userStore, senden }
  }
});
</script>

<style scoped>

</style>
