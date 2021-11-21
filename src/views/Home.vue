<template>
  <div v-if="!userStore.getters.isLoggedIn" class="d-grid gap-2 col-6 mx-auto">
    <Login />
  </div>
  <div v-else class="text-center">
    <h2>Welcome, {{ userStore.state.username }}</h2>
    <button class="btn btn-default" @click="$router.push('join')">
      Join Lobby
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
    <br>
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
