<template>
  
  <Tutorial/>

  <button class="btn btn-success" @click="$router.push('/')">
  Home
  </button>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import  Tutorial  from '../components/lobby/Tutorial.vue';
export default defineComponent({
  name: 'Instructions', 
  components:{Tutorial}
});
</script>


<style scoped>

</style>