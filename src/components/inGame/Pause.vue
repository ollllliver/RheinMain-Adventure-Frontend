<template>
  <div id="fenster">
    <div class="fenster__inner">
      <div class="fenster__top">
        <h1 class="title">Spiel unterbrochen</h1>
      </div>
      <div class="fenster__bottom">
        <button class="button" @click="weiter">Weiter</button>
        <br>
        <button class="button" @click="verlassen">Verlassen</button>
        <br>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useGameEngine} from "@/services/inGame/gameEngine";
import {useLobbyStore} from "@/services/lobby/lobbyService"
import {useChatStore} from "@/services/ChatStore"
import router from "@/router";


export default defineComponent({
  setup() {
    const fenster = document.getElementById("fenster");
    const {disconnect, connect} = useGameEngine();
    const {unsubscribeChat} = useChatStore();
    return {fenster, connect, disconnect, unsubscribeChat}
  },
  methods: {
    /**
     * Die Spielsteuerung wird hinzugefügt
     */
    weiter() {
      this.connect();
      console.log("Pause.weiter: Spiel geht weiter");
    },
    /**
     * Schickt einen zurück zur Lobby-Übersicht
     */
    verlassen() {
      console.log("Pause.abbrechen: Spiel wurde verlassen");
      this.unsubscribeChat();
      this.disconnect();
      router.push(`/lobby/${useLobbyStore().lobbystate.lobbyID}`);
    },
    /**
     * TODO Einstellungen
     */
    einstellungen() {
      console.log("Pause.einstellungen: noch nicht implementiert")
      return "";
    }
  }
});

</script>

<style>
.fenster__inner {
  background: #c0c0c0;
  width: 100%;
  max-width: 800px;
  overflow: hidden;
  border-radius: 4px;

}

.fenster__top {
  display: flex;
  align-items: center;
  background-color: #eeeeee;
  text-align: center;
}


.title {
  flex-grow: 1;
  padding: var(--gap) var(--gap) 0 var(--gap);
  font-size: 20px;
}

.fenster__bottom {
  text-align: center;
  padding: var(--gap) var(--gap) var(--gap) var(--gap);
}

.button {
  display: inline-block;
  padding: 6px 12px;
  background: #ffffff;
  border: none;
  outline: none;
  border-radius: 3px;
  color: #000000;
  cursor: pointer;
  font-size: 18px;
  width: 150px;
  margin: 2px
}

.button:hover {
  background: #e4e4e4;
}
</style>