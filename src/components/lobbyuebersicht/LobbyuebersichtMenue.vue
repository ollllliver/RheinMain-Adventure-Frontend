<template>
    <div class="container">
      <!-- <h1>Übersicht</h1> -->
      <div class="m-3 d-flex justify-content-around">
        <button class="btn btn-success" v-on:click="neueLobby">Spiel hosten</button>
        <button class="btn btn-success" v-on:click="joinRandomLobby">Zufällige Lobby</button>
      </div>
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
