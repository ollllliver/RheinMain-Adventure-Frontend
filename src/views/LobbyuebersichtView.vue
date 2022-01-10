<template>
  <div>
    <!-- Eorror Balken, wenn errormessage vorliegt-->
    <div v-if="alleLobbiesState.errormessage != ''" class="alert alert-danger" role="alert">
      {{alleLobbiesState.errormessage}}
    </div>
    <div class="container">
      <h1>Lobbyübersicht</h1>

      <button class="btn btn-primary" v-on:click="neueLobby">Spiel hosten</button>
      <button class="btn btn-primary" v-on:click="joinRandomLobby">
        Zufällige Lobby
      </button>
    </div>
    <div class="container">
      <li :lobby="lobby" v-for="lobby in alleLobbiesState.lobbies" :key="lobby.lobbyID">
        {{ lobby.lobbyID }}
        <button v-on:click="connectToLobby(lobby.lobbyID)"> beitreten</button>
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted} from "vue";
import { useLobbyStore } from "@/services/lobby/lobbyService";

export default defineComponent({
  name: "LobbyuebersichtView",
  components: {},
  
  setup() {
    const { alleLobbiesState, neueLobby,
    joinRandomLobby, alleLobbiesladen,
    connectToUebersicht, connectToLobby } = useLobbyStore();

    onMounted(() => {
      connectToUebersicht();
      alleLobbiesladen();
    });

    return {
      neueLobby,
      alleLobbiesState,
      connectToLobby,joinRandomLobby,
    };
  },
});
</script>


<style scoped>
</style>