<template>
  <div>
    <!-- Eorror Balken, wenn errormessage vorliegt-->
    <div v-if="errormessage != ''" class="alert alert-danger" role="alert">
      {{errormessage}}
    </div>
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
        <button v-on:click="joinLobby(lobby.lobbyID)"> beitreten</button>
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useLobbyStore } from "@/services/LobbyStore";
import router from "@/router";

export default defineComponent({
  name: "LobbyuebersichtView",
  components: {},
  
  setup() {
    const { neueLobby, alleLobbiesladen, alleLobbiesState,joinRandomLobby, connectToUebersicht } = useLobbyStore();

    onMounted(async () => {
      connectToUebersicht();
      await alleLobbiesladen();
    });

    async function create() {
      const neueLobbyID = await neueLobby();
      router.push("/lobby/" + neueLobbyID);
    }

    function joinLobby(lobbyID: string){
      router.push("/lobby/" + lobbyID);
    }
    function joinrandom(){
      joinRandomLobby().then((lobbyID) =>{
        router.push("/lobby/" + lobbyID);
      }).catch(err => {
        console.log(err);
      });
    }

    const angezeigteLobbies = computed(() => {
      return alleLobbiesState.lobbies;
    });

    return {
      create,
      lobbies: angezeigteLobbies,
      errormessage: ref(alleLobbiesState.errormessage),
      joinLobby,joinrandom
    };
  },
});
</script>


<style scoped>
</style>