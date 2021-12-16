<!-- Editor View für den Level-Editor -->

<template>
  
  <div class="container">

    <!-- leerer Header -->
    <div class="row justify-content-md-center" id="top">
      <div class="col-md-auto">
      </div>
    </div>

    
    <div class="row">

      <!-- Editorfenster -->  
      <div class="col" id="karte">
        <Editorfenster />
      </div>
      
      <!-- Aktionstasten -->  
      <div class="col-col-lg-2" id="aktionstasten">
        <Aktionstasten/>
      </div>

    </div>

    <div class="row">

      <!-- Level Bausteine --> 
      <div class="col" id ="bausteine">
        <Bausteine />
      </div>

      <!-- Info Fenster -->
      <div class="col col-lg-2" id="infofenster">
        {{editorStore.getters.getInfo}}
      </div>

    </div>

  </div>
  
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import Aktionstasten from '../components/EditorKomponente/Aktionstasten.vue'
import Bausteine from '../components/EditorKomponente/Bausteine.vue'
import Editorfenster from '../components/EditorFenster.vue'
import editorStore from '@/stores/editor'

export default defineComponent({
  name: 'Editor',
  components: { Aktionstasten, Bausteine, Editorfenster },
  setup() {
    return { editorStore }
  }
});
</script>


<style scoped>
  html, body {
    height: 100%;
  }
  
  #top {
    height: 40px;
  }
  #karte {
    height: 500px;
    width: 800px;
    border: 2px black solid;
    overflow: hidden;
    position: relative;
    width: 100%;
  }
 
  #aktionstasten {
      margin-left: 60px;
      margin-right: -60px;
      height: 300px;
      width: 30%;
  }
 
  #infofenster {
    width: 30%;
    margin-left: 10px;
    margin-right: -60px;
    margin-top: -140px;
    margin-bottom: 90px;
    border: 1px solid black;
  }

  #bausteine {
    width: 70%;
    margin-top: 20px;
    margin-right: 50px;
    height: 70px;
    border: 1px black solid;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>