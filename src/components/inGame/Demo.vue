<template>
  <div id="container">
    <h2 id="interaktionText"></h2>
  </div>
</template>

<script lang="ts">
import * as Three from "three";
import {defineComponent, onMounted} from "vue";
import {GraphicLoader} from '@/services/inGame/GraphicLoader';
import {MyMouseControls} from '@/services/inGame/MyMouseControls';
import {MyKeyboardControls} from '@/services/inGame/MyKeyboardControls';
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Wird benutzt fuer Developersicht in bspw. initRenderer
import {SpielerLokal} from '@/models/SpielerLokal';
import { gamebrokerStompclient, subscribeToSpielerPositionenUpdater } from "@/services/inGame/spielerPositionierer";
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
      initInteractionTestObject();
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
