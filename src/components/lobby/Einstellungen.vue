<template>
  <div>
    <div v-if="lobbystate.host.name == userStore.state.benutzername">
      <!-- TITEL -->
      <h1 class="row">Einstellungen</h1>

      <!-- INFOS -->
      <h3>
        Teilnehmer: {{ lobbystate.teilnehmerliste.length }} \
        {{ lobbystate.spielerlimit }}
      </h3>

      <!-- AUSWAHL - Spielerlimit -->
      <div>
        <label class="h3">Spielerlimit:&nbsp;</label>
        <select class="h4" v-model="spielerlimit" @change="changeLimit">
          <option
            :text="zahl"
            :value="zahl"
            v-for="zahl in limitArray"
            :key="zahl"
          ></option>
        </select>
      </div>

      <!-- AUSWAHL - Privatsphäre -->
      <div>
        <label class="h3">Lobby&nbsp;</label>
        <select class="h4" v-model="istPrivat" @change="changePrivacy">
          <option value="true">privat</option>
          <option value="false">öffentlich</option>
        </select>
      </div>

      <!-- AUSWAHL - Host -->
      <div>
        <label class="h3">Host:&nbsp;</label>
        <select class="h4" v-model="host" @change="changeHost">
          <option
            :text="teilnehmer.name"
            v-for="teilnehmer in lobbystate.teilnehmerliste"
            :key="teilnehmer.id"
          ></option>
        </select>
      </div>

      <!-- START BUTTON -->
      <button class="row btn btn-primary" v-on:click="starten" :disabled="startbuttonUnsichtbar">
        SPIEL STARTEN
      </button>
    </div>
    <div v-else>
      <h1 class="row">Einstellungen</h1>
      <h3 class="row">Teilnehmer: {{ lobbystate.teilnehmerliste.length }} \{{ lobbystate.spielerlimit }}</h3>
      <h3 class="row">istVoll: {{ lobbystate.istVoll }}</h3>
      <h3 class="row">spielerlimit: {{ lobbystate.spielerlimit }}</h3>
      <h3 class="row">istGestartet: {{ lobbystate.istGestartet }}</h3>
      <h3 class="row">private Lobby: {{ lobbystate.istPrivat }}</h3>
      <h3 class="row">host: {{ lobbystate.host.name }}</h3>
    </div>
    <h1>{{ lobbystate.countdown }}</h1>
    <audio id="ticking">
      <source src="../../assets/sounds/ticking.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watchEffect, ref } from "vue";
import { useLobbyStore } from "@/services/LobbyStore";
import userStore from "@/stores/user";
import router from "@/router";
export default defineComponent({
  name: "Einstellungen",
  setup() {
    const { lobbystate, starteLobby, einstellungsfunktionen } = useLobbyStore();
    // DEFAULT max spielerlimit aktuell = 10
    const limitArray = ref(Array.from({ length: 10 }, (_, i) => i + 1));
    // das setzt spielerlimit immer auf das neuste lobbystate.spielerlimit
    // eventuell eine art lobbystate.karte mit maxSpieler?
    // watchEffect(() => limitArray.value = Array.from({length: lobbystate.karte.maxSpieler}, (_, i) => i + 1));
    // gibt es noch nicht -> ^^^^^^^^^^^^^^^^^^^^^^^^^^^

    let startbuttonUnsichtbar = ref(false);

    // ref's auf änderbare Einstellungen und watchEffects auf lobbystate parameter für den neusten Stand
    const spielerlimit = ref();
    watchEffect(() => (spielerlimit.value = lobbystate.spielerlimit));
    const istPrivat = ref();
    watchEffect(() => (istPrivat.value = lobbystate.istPrivat));
    const host = ref();
    watchEffect(() => (host.value = lobbystate.host.name));

    // 3 FUNKTIONEN zum ändern der änderbare Einstellungen:
    function changeLimit() {
      einstellungsfunktionen["changeLimit"](spielerlimit.value);
    }
    function changePrivacy() {
      einstellungsfunktionen["changePrivacy"](istPrivat.value);
    }
    function changeHost() {
      einstellungsfunktionen["changeHost"](host.value);
    }

    function starten() {
      // startbutton.setAttribute("disabled", "disabled");
      startbuttonUnsichtbar.value = true;
      starteLobby()
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });

    }

    return {
      lobbystate,
      userStore,
      starten,
      spielerlimit,
      changeLimit,
      limitArray,
      istPrivat,
      changePrivacy,
      host,
      changeHost,
      startbuttonUnsichtbar,
    };
  },
});
</script>

<style scoped>
</style>
