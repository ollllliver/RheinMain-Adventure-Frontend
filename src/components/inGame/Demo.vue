<template>
  <div>
    <Pause id="pause"/>
    <div id="container">
      <h2 id="interaktionText"></h2>
      <h2 id="SchluesselAnzeige"></h2>
    </div> 
    <div class="GameChat">
      <button type="button" id="ChatButton">Chat</button>
      <Chat :sendeNachricht="sendeChatNachricht" class="row border border-secondary rounded px-4 mt-3" id="Chat" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import { useGameEngine } from "@/services/inGame/gameEngine";
import Pause from "./Pause.vue";
import Chat from "@/components/lobby/Chat.vue";
import { useChatStore } from "@/services/ChatStore";


export default defineComponent({
  name: "RenderDemo",
  components: { Pause, Chat},
  setup() {

    const {initScene, initLoader, initCamera, initPlane, initInteractionTestObject, initRenderer, initControls, initInteractions, initChat, doAnimate, connect, disconnect, setContainer} = useGameEngine();
    const { sendeChatNachricht, empfangeChatNachricht} = useChatStore();

    onMounted(() => {
      setContainer(document.getElementById("container"));
      initScene();
      initLoader();
      initCamera();
      initPlane();
      //initInteractionTestObject();
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
