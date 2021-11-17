<template>
    <div>
      <center>
      <h1> Join Lobby Page </h1>
      </center>
      <button class="btn btn-primary" @click="$router.push('/')">
        Home
      </button>
      <Tutorial/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import  Tutorial  from '../components/Howto.vue';
export default defineComponent({
  name: 'Join', 
  components:{Tutorial}
});
</script>


<style scoped>

</style>