<!-- Register View um sich zu registrieren -->

<template>
  <div v-if="userStore.getters.getError != ''" class="alert alert-danger" role="alert">
    {{userStore.getters.getError}}
  </div>
  <div class="center">
    <Signup/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import Signup from '@/components/Signup.vue'
import userStore from '@/stores/user'

export default defineComponent({
  name: 'Home',
  components: {
    Signup
  },
  setup() {
    onMounted(() => {
      userStore.setError("")
    }) 
    return { userStore }
  }
});
</script>