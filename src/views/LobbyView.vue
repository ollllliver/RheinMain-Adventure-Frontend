<template>
  <!-- die darfBeitreten ist dafür, wenn jemand per Link joint, aber nicht joinen darf,
  dass in dem Moment, bevor man zurück zur Übersicht gepusht wird, nichts angezeigt wird. -->
  <div v-if="lobbystate.darfBeitreten">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand">Lobby {{ lobbystate.lobbyID }}</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link disabled" href="#">Disabled Button</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
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
    const { lobbystate, connectToLobby, leaveLobby, sendeChatNachricht, empfangeChatNachricht} = useLobbyStore();

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
