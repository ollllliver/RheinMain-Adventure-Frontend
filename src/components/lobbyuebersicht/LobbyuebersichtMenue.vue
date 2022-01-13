<template>
    <div class="container">
      <h1>Lobbyübersicht</h1>

      <button class="btn btn-primary" v-on:click="neueLobby">Spiel hosten</button>
      <button class="btn btn-primary" v-on:click="joinRandomLobby">Zufällige Lobby</button>
    </div>

</template>


<script lang="ts">
import { defineComponent } from "vue";
import { useLobbyStore } from "@/services/lobby/lobbyService";

export default defineComponent({
  name: "LobbyuebersichtMenue",

  props: {},
  setup() {
    const { neueLobby, joinRandomLobby } = useLobbyStore();

    return {
      neueLobby,joinRandomLobby,
    };
  },
});
</script>
