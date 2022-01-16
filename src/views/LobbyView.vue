<template>
  <!-- die darfBeitreten ist dafür, wenn jemand per Link joint, aber nicht joinen darf,
  dass in dem Moment, bevor man zurück zur Übersicht gepusht wird, nichts angezeigt wird. -->
  <div v-if="lobbystate.darfBeitreten">
    <!-- Eorror Balken, wenn errormessage vorliegt-->
    <div v-if="lobbystate.errormessage != ''" class="alert alert-danger" role="alert">
      {{lobbystate.errormessage}}
    </div>
    <div class="row" style="margin:1em;">
      <Einstellungen class="col border border-secondary rounded px-4 mx-3" />
      <div class="col">
        <div class="row">
          <h1 class="col"> Spieler</h1>
          <button class="btn btn-success col" v-on:click="leaveLobby">LEAVE LOBBY</button>
        </div>
        <Teilnehmerliste class="row border border-secondary rounded px-4 mt-3" />
        <InviteCopy :link="link" class="row border border-secondary rounded px-4 mt-3" />
        <Chat :sendeNachricht="sendeChatNachricht" class="row border border-secondary rounded px-4 mt-3" />
      </div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted} from "vue";
import { useLobbyStore } from "@/services/lobby/lobbyService";
import { useChatStore } from "@/services/ChatStore";
import InviteCopy from "@/components/lobby/InviteCopy.vue";
import Chat from "@/components/lobby/Chat.vue";
import Einstellungen from "@/components/lobby/Einstellungen.vue";
import Teilnehmerliste from "@/components/lobby/Teilnehmerliste.vue";

export default defineComponent({
  name: "Lobby",
  components: { InviteCopy, Chat, Einstellungen, Teilnehmerliste },
  props: {
    lobby_id: { type: String, required: true },
  },
  setup(props) {
    const { lobbystate, connectToLobby, leaveLobby} = useLobbyStore();
    const { sendeChatNachricht, empfangeChatNachricht} = useChatStore();

    window.addEventListener('beforeunload',function(e){
      leaveLobby();
    });

    onMounted(async () => {
      connectToLobby(String(props.lobby_id));
    });

    return {
      lobbystate,
      link: window.location.href, //aktueller Link der Seite
      sendeChatNachricht,
      empfangeChatNachricht,
      leaveLobby,
    };
  },
});
</script>
