<template>
    <div class="container">
      <li :lobby="lobby" v-for="lobby in alleLobbiesState.lobbies" :key="lobby.lobbyID">
        {{ lobby.lobbyID }}
        <button v-on:click="connectToLobby(lobby.lobbyID)"> beitreten</button>
      </li>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { useLobbyStore } from "@/services/lobby/lobbyService";

export default defineComponent({
  name: "Lobbyliste",

  props: {},
  setup() {
    const { alleLobbiesState, connectToLobby } = useLobbyStore();

    return {
      alleLobbiesState,connectToLobby,
    };
  },
});
</script>
