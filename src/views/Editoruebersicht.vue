<!-- Editorübersicht -->

<template>

<div class="container">
    
  <div class="row justify-content-md-center">
    <div class="col-md-auto">
      <h4> Wähle eine Karte aus zum bearbeiten </h4>
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
    <div class="col col-lg-2">
    <!-- Wechsel zum "Editor"-Fenster -->
      <button class="btn btn-outline-secondary" @click="$router.push('/editor')">
        neue Karte
      </button>
    </div>
    
  </div>
</div>
    
</template>

<script lang="ts">
import Karten from '@/components/EditorKomponenten/Karten.vue';
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  name: 'Editoruebersicht',
  components:{Karten}
});


</script>
