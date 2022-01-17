<!-- Home View mit Login/Regestrieren Formular -->

<template>
  <div v-if="!userStore.getters.istEingeloggt" class="d-grid gap-2 col-6 mx-auto">
    <Login />
  </div>
  <div v-else class="text-center">
    <h2>Welcome, {{ userStore.state.benutzername }}</h2>
    <button class="btn btn-default" @click="$router.push('environment')">
      Game Environment
    </button>
    <button class="btn btn-default" @click="$router.push('editor')">
      Level Editor
    </button>
    <br>
    <MazeMenue/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import userStore from '@/stores/user'
import Login from '@/components/Login.vue'
import MazeMenue from "@/components/home/MazeMenue.vue"
export default defineComponent({
  name: 'Home',
  components: { Login, MazeMenue },
  setup() {
    onMounted(userStore.getUser)
    return { userStore }
  }
});
</script>

<style scoped>

</style>
