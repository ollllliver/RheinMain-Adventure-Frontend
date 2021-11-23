<template>
  <div>
    <div class="container">
      <h1>Lobbyübersicht</h1>

      <button class="btn btn-primary" v-on:click="create">Spiel hosten</button>
      <button class="btn btn-primary" v-on:click="joinrandom">
        Zufällige Lobby
      </button>
    </div>
    <div class="container">
      <li :lobby="lobby" v-for="lobby in lobbies" :key="lobby.lobbyID">
        {{ lobby.lobbyID }}
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useLobbyStore } from "@/services/LobbyStore";
import router from "@/router";

export default defineComponent({
  name: "LobbyView",
  components: {},
  props: {
    lobby_id: { type: String, reqired: true },
  },
  
  setup(props) {
    const { neueLobby, alleLobbiesladen, alleLobbiesState } = useLobbyStore();

    onMounted(async () => {
      await alleLobbiesladen();
    });

    async function create() {
      const neueLobbyID = await neueLobby();
      console.log("neueLobbyID", neueLobbyID);
      router.push("/lobby/" + neueLobbyID);
    }

    const angezeigteLobbies = computed(() => {
      return alleLobbiesState.lobbies;
    });

    return {
      create,
      lobbies: angezeigteLobbies,
    };
  },
});
</script>


<style scoped>
</style>