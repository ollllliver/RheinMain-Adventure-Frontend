<!-- Editorübersicht -->

<template>

<div class="container">
    
  <div class="row justify-content-md-center">
    <div class="col-md-auto" id="willkommen">
      <h4> Wähle ein Level aus zum bearbeiten </h4>
    </div>
  </div>

  <Karten/>
  <div class="row">
    <div class="col">

    </div>
   
    
    
  </div>
</div>
    
</template>

<script lang="ts">
import Karten from '@/components/editor/Karten.vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Editoruebersicht',
  components:{Karten}
});


</script>

<style scoped>
  #willkommen{
    margin-top: 50px;
  }
</style>
