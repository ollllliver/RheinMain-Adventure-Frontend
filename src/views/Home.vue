<!-- Home View mit Login/Regestrieren Formular -->

<template>
  <div class="text-center">
    <h2>Welcome, {{ userStore.state.benutzername }}</h2>
    <br>
    <MazeMenue/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import userStore from '@/stores/user'
import MazeMenue from "@/components/home/MazeMenue.vue"

export default defineComponent({
  name: 'Home',
  components: { MazeMenue },
  setup() {
    onMounted(userStore.getUser)
    return { userStore }
  }
});
</script>

<style scoped>

</style>