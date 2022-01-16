<template>
  <div id="container">
    <h2 id="interaktionText"></h2>
  </div>
  <div>
    <button class="btn btn-default" @click="beenden">
      SPIEL BEENDEN
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {useGameEngine} from "@/services/inGame/gameEngine";
import {useLobbyStore} from "@/services/lobby/lobbyService";


export default defineComponent({
  name: "RenderDemo",
  setup() {

    const {beendeSpiel} = useLobbyStore();

    const {
      initScene,
      initLoader,
      initCamera,
      initPlane,
      initRaycaster,
      initRenderer,
      initControls,
      initInteractions,
      doAnimate,
      connect,
      disconnect,
      setContainer
    } = useGameEngine();
    

    onMounted(() => {
      setContainer(document.getElementById("container"));
      initScene();
      initLoader();
      initCamera();
      initPlane();
      initRaycaster();
      initRenderer();
      initControls();
      initInteractions();
      doAnimate();

    });

    function beenden () {
      beendeSpiel();
    }

    return {connect, disconnect, beenden}

  },
  beforeUnmount() {

    this.disconnect();
    console.log("unmounted")
  },
});


</script>

<style scoped>
</style>
