<!-- Home View mit Login/Regestrieren Formular -->

<template>
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

    onMounted(userStore.getUser)
    return { userStore }
    
  }
});
</script>

<style scoped>

</style>