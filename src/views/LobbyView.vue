<template>
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
  <div class="container mt-5" v-if="darfBeitreten">
    <div class="row">
      <Einstellungen class="col border border-secondary rounded px-4 mx-3" />
      <div class="col">
        <div class="row">
          <h1 class="col"> Spieler</h1>
          <button class="btn btn-primary col" v-on:click="verlassen">LEAVE LOBBY</button>
        </div>
        <Teilnehmerliste class="row border border-secondary rounded px-4 mt-3" />
        <InviteCopy :link="link" class="row border border-secondary rounded px-4 mt-3" />
        <Chat :sendeNachricht="sendeChatNachricht" class="row border border-secondary rounded px-4 mt-3" />
      </div>
  </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useLobbyStore } from "@/services/LobbyStore";
import { Benutzer } from "@/services/Benutzer";
import InviteCopy from "@/components/lobby/InviteCopy.vue";
import Chat from "@/components/lobby/Chat.vue";
import Einstellungen from "@/components/lobby/Einstellungen.vue";
import Teilnehmerliste from "@/components/lobby/Teilnehmerliste.vue";

export default defineComponent({
  name: "Lobby",
  components: { InviteCopy, Chat, Einstellungen, Teilnehmerliste },
  props: {
    lobby_id: { type: String, reqired: true },
  },
  setup(props) {
    const { lobbystate, connectToLobby, joinLobby, leaveLobby, sendeChatNachricht, empfangeChatNachricht} = useLobbyStore();
    const linkInput = ref("");

    const darfBeitreten = computed(() => {
      return lobbystate.darfBeitreten;
    });

    onMounted(async () => {
      connectToLobby(String(props.lobby_id));
    });

    const link = computed(() => {
      return "http://localhost:3000/lobby/" + props.lobby_id; //TODO baseURL + port + LobbyID
    });

    async function verlassen(username: string) {
      console.log("/topic/lobby/" + props.lobby_id + " - " + username);
      leaveLobby(username);
    }

    return {
      lobbystate,
      link,
      darfBeitreten,
      sendeChatNachricht,
      empfangeChatNachricht,
      verlassen,
    };
  },
});
</script>
