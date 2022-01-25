<!-- Home View mit Login/Regestrieren Formular -->

<template>
    <div v-if="userStore.getters.getError != ''" class="alert alert-danger" role="alert">
      {{userStore.getters.getError}}
    </div>
  <Login />
</template>

<script lang="ts">
import { defineComponent, onMounted} from 'vue';
import userStore from '@/stores/user'
import Login from '@/components/Login.vue'

export default defineComponent({
  name: 'LoginView',
  components: { Login },
  setup() {

   onMounted(() => {
      userStore.setError("")
    }) 
    return { userStore }
    
  }
});
</script>

<style scoped>

</style>