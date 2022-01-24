<!-- Home View mit Login/Regestrieren Formular -->

<template>
  <div v-if="!userStore.getters.istEingeloggt" class="d-grid gap-2 col-6 mx-auto">
    <Login />
  </div>
  <div v-else class="text-center">
    <h2>Welcome, {{ userStore.state.benutzername }}</h2>
    <br>
    <LabyrinthMenue/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted} from 'vue';
import userStore from '@/stores/user'
import Login from '@/components/Login.vue'
import LabyrinthMenue from "@/components/menue/LabyrinthMenue.vue"
export default defineComponent({
  name: 'Home',
  components: { Login, LabyrinthMenue },
  setup() {

    onMounted(userStore.getUser)
    return { userStore }
    
  }
});
</script>

<style scoped>

</style>