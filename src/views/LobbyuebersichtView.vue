<template>
  <div>
    <!-- Eorror Balken, wenn errormessage vorliegt-->
    <div v-if="alleLobbiesState.errormessage != ''" class="alert alert-danger" role="alert">
      {{alleLobbiesState.errormessage}}
    </div>
    <LobbyuebersichtMenue/>
    <Lobbyliste/>
  </div>
</template>

<script lang="ts">
import Lobbyliste from "@/components/lobbyuebersicht/Lobbyliste.vue"
import LobbyuebersichtMenue from "@/components/lobbyuebersicht/LobbyuebersichtMenue.vue"
import { defineComponent, onMounted} from "vue";
import { useLobbyStore } from "@/services/lobby/lobbyService";

export default defineComponent({
  name: "LobbyuebersichtView",
  components: {Lobbyliste, LobbyuebersichtMenue},
  
  setup() {
    const { alleLobbiesState, neueLobby, joinRandomLobby, alleLobbiesladen, connectToUebersicht } = useLobbyStore();

    onMounted(() => {
      connectToUebersicht();
      alleLobbiesladen();
    });

    return {
      Lobbyliste, LobbyuebersichtMenue,
      neueLobby,
      alleLobbiesState,
      joinRandomLobby,
    };
  },
});
</script>


<style scoped>
</style>