<template>
  <div id="container">
    <h2 id="interaktionText"></h2>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import { useGameEngine } from "@/services/inGame/gameEngine";


export default defineComponent({
  name: "RenderDemo",
  setup() {

    const {initScene, initLoader, initCamera, initPlane, initInteractionTestObject, initRaycaster, initRenderer, initControls, initInteractions, doAnimate, connect, disconnect, setContainer} = useGameEngine();
    

    onMounted(() => {
      setContainer(document.getElementById("container"));
      initScene();
      initLoader();
      initCamera();
      initPlane();
      //initInteractionTestObject();
      initRaycaster();
      initRenderer();
      initControls();
      initInteractions();
      doAnimate();

    });

    return {connect, disconnect}

  },
  beforeUnmount() {

    this.disconnect();
    console.log("unmounted")
  },
});


</script>

<style scoped>
</style>
