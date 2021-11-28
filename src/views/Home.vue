<!-- Home View mit Login/Regestrieren Formular -->

<template>
  <div v-if="!userStore.getters.istEingeloggt" class="d-grid gap-2 col-6 mx-auto">
    <Login />
  </div>
  <div v-else class="text-center">
    <h2>Welcome, {{ userStore.state.benutzername }}</h2>
      <!-- Wechsel zum "Join"-Fenster -->
     <button class="btn btn-default" @click="$router.push('join')">
      Join Lobby
    </button>
    <!-- Wechsel zum "Create"-Fenster -->
     <button class="btn btn-default" @click="$router.push('create')">
      Create Lobby
    </button>
    <!-- Wechsel zum "Editor"-Fenster -->
    <button class="btn btn-default" @click="$router.push('editor')">
      Level Editor
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
import userStore from '@/stores/user'
import Login from '@/components/Login.vue'
export default defineComponent({
  name: 'Home',
  components: { Login },
  setup() {
    onMounted(userStore.getUser)
    return { userStore }
  }
});
</script>

<style scoped>

</style>
