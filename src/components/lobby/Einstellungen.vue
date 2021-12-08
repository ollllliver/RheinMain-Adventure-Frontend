<template>
  <div>
    <h1 class="row">Einstellungen</h1>
    <h3 class="row">istVoll: {{ lobbystate.istVoll }}</h3>
    <h3 class="row">spielerlimit: {{ lobbystate.spielerlimit }}</h3>
    <h3 class="row">istGestartet: {{ lobbystate.istGestartet }}</h3>
    <h3 class="row">private Lobby: {{ lobbystate.istPrivat }}</h3>
    <h3 class="row">host: {{ lobbystate.host.name }}</h3>
    <button class="row btn btn-primary" v-on:click="starten">
      SPIEL STARTEN
    </button>
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, watchEffect, watch } from "vue";
import { useLobbyStore } from "@/services/LobbyStore";
import { Timer } from "@/components/models/Timer";
import router from "@/router";
export default defineComponent({
  name: "Einstellungen",
  setup() {
    
    const { lobbystate, starteLobby } = useLobbyStore();
    function starten() {
      starteLobby()
        .then((response) => {
          //TODO : HIER ANSICHT WECHSELN UND VISUELLEN 10 SEKUNDEN TIMER STARTEN
          console.log(response);
          router.push("/environment");
          /*
          watchEffect(() => checkStatus(lobbystate.istGestartet))
          watch(lobbystate, (state) => {
              checkStatus(state.istGestartet);
          })
          */
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function checkStatus(state: boolean) {
        if (state == true) {
            router.push("/environment");
        }
    }
    return {
      starten,
      lobbystate,
    };
  },
});
</script>
