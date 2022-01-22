<!-- Editorübersicht -->

<template>

<div class="container">
    
  <div class="row justify-content-md-center">
    <div class="col-md-auto">
      <h4> Wähle ein Level aus zum bearbeiten </h4>
    </div>
  </div>

  <Karten> </Karten>
  <div class="row">
    <div class="col">

    </div>
    <div class="col-md-auto">
      <!-- Wechsel zum "Home"-Fenster -->
      <button class="btn btn-outline-secondary" @click="$router.push('/')">
        Zurück zum Menü
      </button>
    </div>
    
    
  </div>
</div>
    
</template>

<script lang="ts">
import Karten from '@/components/editor/Karten.vue';
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  name: 'Editoruebersicht',
  components:{Karten}
});


</script>
