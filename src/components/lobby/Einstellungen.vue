<template>
  <div>
    <h1 class="row">Einstellungen</h1>
    <h3 class="row">istVoll: {{ lobbystate.istVoll }}</h3>
    <h3 class="row">spielerlimit: {{ lobbystate.spielerlimit }}</h3>
    <h3 class="row">istGestartet: {{ lobbystate.istGestartet }}</h3>
    <h3 class="row">private Lobby: {{ lobbystate.istPrivat }}</h3>
    <h3 class="row">host: {{ lobbystate.host }}</h3>
    <button id="start" class="row btn btn-primary" v-on:click="starten" onClick=disabled>SPIEL STARTEN</button>
    <h1>{{ timer.time }}</h1>
    <audio autoplay id="ticking"><source src="../../assets/sounds/ticking.mp3" type="audio/mpeg"></audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { useLobbyStore } from "@/services/LobbyStore";
import router from "@/router";
export default defineComponent({
  name: "Einstellungen",
  setup() {
    const { lobbystate, starteLobby } = useLobbyStore();
    const timer = reactive({
      time: 10,
      color: "green"
    });

    async function starten() {
      starteLobby()
        .then((response) => {
          console.log(response);
          starteTimer();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function starteTimer(delay = 1000) {
      if (timer.time > 0) {
        setTimeout(() => {
          timer.time -= 1;
          starteTimer();
        }, delay);
      }
      else {
        router.push("/environment");
      }
    }

    return {
      starten,
      lobbystate,
      starteTimer,
      timer
    };
  },
});
</script>

<style scoped>

</style>
