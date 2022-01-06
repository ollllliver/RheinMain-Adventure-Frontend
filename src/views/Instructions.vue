<template>
    <div>
      <button class="btn btn-primary" @click="$router.push('/')">
        Home
      </button>
      <Tutorial/>
    </div>
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