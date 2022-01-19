<template>
  <div>
    <Pause id="pause" />
    <div id="container">
      <h2 id="interaktionText"></h2>
    </div>
  </div>
  <div>
    <button class="btn btn-default" @click="beenden">SPIEL BEENDEN</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useGameEngine } from "@/services/inGame/gameEngine";
import { useLobbyStore } from "@/services/lobby/lobbyService";
import Pause from "./Pause.vue";

export default defineComponent({
  name: "RenderDemo",
  components: { Pause },
  setup() {
    const { beendeSpiel } = useLobbyStore();

    const {
      initScene,
      initLoader,
      initCamera,
      initPlane,
      initRaycaster,
      initRenderer,
      initControls,
      initInteractions,
      startAnimate,
      stopAnimate,
      connect,
      disconnect,
      setContainer,
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
      startAnimate();
    });

    function beenden() {
      beendeSpiel();
    }

    return { connect, disconnect, beenden, stopAnimate };
  },
  beforeUnmount() {
    this.stopAnimate();
    this.disconnect();
    console.log("unmounted");
  },
});
</script>

<style scoped>
#pause {
  --gap: 15px;

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--gap);
  background: rgba(0, 0, 0, 0.5);
  font-family: sans-serif;
}
</style>
