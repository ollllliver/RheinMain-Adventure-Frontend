<!-- Home View mit Login/Regestrieren Formular -->

<template>
  <div class="text-center">
    <h2>Welcome, {{ userStore.state.benutzername }}</h2>
    <br>
    <LabyrinthMenue/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import userStore from '@/stores/user'
import LabyrinthMenue from "@/components/menue/LabyrinthMenue.vue"

export default defineComponent({
  name: 'Home',
  components: {LabyrinthMenue},
  setup() {

    onMounted(userStore.getUser)
    return {userStore}

  }
});
</script>

<style scoped>

</style>