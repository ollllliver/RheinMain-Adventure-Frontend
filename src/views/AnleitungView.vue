<template>
  <div class="m-5">
    <Anleitung/>
    <button class="btn btn-success m-3" @click="$router.push('/home')">
    Home
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import  Anleitung  from '@/components/Anleitung.vue';
export default defineComponent({
  name: 'AnleitungView', 
  components:{Anleitung}
});
</script>


<style scoped>

</style>