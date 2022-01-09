<template>
  <div id="container"></div>

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

    const {initScene, initLoader, initCamera, initPlane, initRaycaster, initRenderer, initControls, doAnimate, connect, disconnect, setContainer} = useGameEngine();
    

    onMounted(() => {
      setContainer(document.getElementById("container"));
      initScene();
      initLoader();
      initCamera();
      initPlane();
      initRaycaster();
      initRenderer();
      initControls();
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
