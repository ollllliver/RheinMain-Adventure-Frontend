<template>
  <div id="container">
    <h2 id="interaktionText"></h2>
    <div class="GameChat">
      <button type="button" id="ChatButton">Chat</button>
      <Chat :sendeNachricht="sendeChatNachricht" class="row border border-secondary rounded px-4 mt-3" id="Chat" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import { useGameEngine } from "@/services/inGame/gameEngine";
import Chat from "@/components/lobby/Chat.vue";
import { useChatStore } from "@/services/ChatStore";


export default defineComponent({
  name: "RenderDemo",
  components: {Chat},
  setup() {

    const {initScene, initLoader, initCamera, initPlane, initInteractionTestObject, initRaycaster, initRenderer, initControls, initInteractions, initChat, doAnimate, connect, disconnect, setContainer} = useGameEngine();
    const { sendeChatNachricht, empfangeChatNachricht} = useChatStore();

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
      initChat();
      doAnimate();

    });

    return {connect, disconnect, sendeChatNachricht, empfangeChatNachricht}

  },
  beforeUnmount() {

    this.disconnect();
    console.log("unmounted")
  },
});


</script>

<style scoped>
</style>
