<template>
  <div id="container"></div>

</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
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
