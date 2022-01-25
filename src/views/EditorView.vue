<!-- Editor View für den Level-Editor -->

<template>

  <div class="container">

    <!-- leerer Header -->
    <div id="top" class="row justify-content-md-center">
      <div class="col-md-auto">
      </div>
    </div>

    <div class="row">

      <!-- Editorfenster -->
      <div id="karte" class="col">
        <Editorfenster/>
      </div>

      <!-- Aktionstasten -->
      <div id="aktionstasten" class="col-col-lg-2">
        <Aktionstasten/>
      </div>

    </div>

    <div class="row">

      <!-- Level Bausteine -->
      <div id="bausteine" class="col">
        <Bausteine/>
      </div>

      <!-- Info Fenster -->
      <div id="infofenster" class="col col-lg-2">
        <p class="infotext">{{ editorStore.getters.getInfo }}</p>
      </div>

    </div>

  </div>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Aktionstasten from '../components/editor/Aktionstasten.vue'
import Bausteine from '../components/editor/Bausteine.vue'
import Editorfenster from '../components/editor/EditorFenster.vue'
import editorStore from '@/stores/editor'

export default defineComponent({
  name: 'Editor',
  components: {Aktionstasten, Bausteine, Editorfenster},
  setup() {
    return {editorStore}
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
  max-width: 800px;
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
  margin-top: -200px;
  margin-bottom: 90px;
  border: 1px solid black;
}

#bausteine {
  width: 70%;
  max-width: 800px;
  margin-top: 20px;
  margin-right: 50px;
  height: 70px;
  border: 1px black solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.infotext {
  font-weight: 300;
  color: black;

}

#eigenschaften {
  margin-top: 20px;
}

</style>