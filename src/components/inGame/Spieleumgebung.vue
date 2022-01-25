<template>
  <div>
    <Ziel id="ziel" />
    <Pause id="pause" />
    <h2 id="interaktionText"></h2>
    <p id="schluesselText">x 0</p>
    <div class="GameChat">
      <button type="button" id="ChatButton">Chat</button>
      <Chat :sendeNachricht="sendeChatNachricht" class="row border border-secondary rounded px-4 mt-3" id="Chat" />
    </div>
    <img src="@/assets/img/key.png" class="key" alt="" width="50" height="50"/>
    <div id="container" class="m-0 p-0"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {useGameEngine} from "@/services/inGame/gameEngine";
import Pause from "./Pause.vue";
import Chat from "@/components/lobby/Chat.vue";
import {useChatStore} from "@/services/ChatStore";
import Ziel from "./Ziel.vue";


export default defineComponent({
  name: "RenderDemo",
  components: {Pause, Chat, Ziel},
  setup() {
    const {
      initScene,
      initLoader,
      initCamera,
      initPlane,
      initSkybox,
      initRaycaster,
      initRenderer,
      initControls,
      initInteractions,
      initChat,
      startAnimate,
      stopAnimate,
      clearMapContent,
      connect,
      disconnect,
      setContainer,
    } = useGameEngine();

    const { sendeChatNachricht, empfangeChatNachricht} = useChatStore();
    

    onMounted(() => {
      setContainer(document.getElementById("container"));
      initScene();
      initLoader();
      initCamera();
      initPlane();
      initSkybox();
      initRaycaster();
      initRenderer();
      initControls();
      initInteractions();
      initChat();
      startAnimate();
    });

    return {connect, disconnect, stopAnimate, clearMapContent, sendeChatNachricht, empfangeChatNachricht}
  },
  beforeUnmount() {
    this.stopAnimate();
    this.clearMapContent();
    this.disconnect();
  },
});
</script>

<style scoped>
#pause, #ziel{
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
