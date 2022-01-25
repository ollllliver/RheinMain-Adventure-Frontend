<template>
  <div>
    <div v-if="lobbystate.host.name == userStore.state.benutzername">
      <!-- TITEL -->
      <h1 class="row">Einstellungen</h1>
      <!-- INFOS -->
      <h3>Teilnehmer: {{ lobbystate.teilnehmerliste.length }} \ {{ lobbystate.spielerlimit }}</h3>
      <!-- AUSWAHL - Karte -->
      <div>
        <label class="h3">Karte:&nbsp;</label>
        <select class="h4" v-model="gewaehlteKarte" @change="changeKarte">
          <option
            :text="karte.name"
            :value="karte"
            v-for="karte in kartenArray"
            :key="karte"
          ></option>
        </select>
      </div>
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
      <div class="row">
        <!-- START BUTTON -->
        <button class="m-4 col btn btn-success" v-on:click="starten" :disabled="startbuttonUnsichtbar">SPIEL STARTEN</button>
        <h1 v-if="lobbystate.istGestartet" class="m-4 col">{{ lobbystate.countdown }}</h1>
      </div>
    </div>
    <div v-else>
      <h1 class="row">Einstellungen</h1>
      <h3 class="row">Teilnehmer: {{ lobbystate.teilnehmerliste.length }}/{{ lobbystate.spielerlimit }}</h3>
      <h3 class="row">Karte: {{ lobbystate.gewaehlteKarte.name }}</h3>
      <h3 v-if="lobbystate.istPrivat" class="row">Lobby: privat</h3>
      <h3 v-else class="row">Lobby: öffentlich</h3>
      <h3 class="row">Host: {{ lobbystate.host.name }}</h3>
      <h1 v-if="lobbystate.istGestartet">{{ lobbystate.countdown }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref, computed, onMounted } from "vue";
import { useLobbyStore } from "@/services/lobby/lobbyService";
import userStore from "@/stores/user";
export default defineComponent({
  name: "Einstellungen",
  setup() {
    onMounted(() => {
      alleKartenLaden();
    });

    const {
      lobbystate,
      starteLobby,
      einstellungsfunktionen,
      alleKartenLaden,
      alleKartenState,
    } = useLobbyStore();

    // Setzt das Spielerlimit immer auf das neuste lobbystate.spielerlimit
    const limitArray = ref(Array.from({ length: 9 }, (_, i) => (i+1) + 1));

    const kartenArray = computed(() => {
      return alleKartenState.karten;
    });

    let startbuttonUnsichtbar = ref(false);

    // ref's auf änderbare Einstellungen und watchEffects auf lobbystate parameter für den neusten Stand
    const gewaehlteKarte = ref();
    watchEffect(() => (gewaehlteKarte.value = lobbystate.gewaehlteKarte));
    const spielerlimit = ref();
    watchEffect(() => (spielerlimit.value = lobbystate.spielerlimit));
    const istPrivat = ref();
    watchEffect(() => (istPrivat.value = lobbystate.istPrivat));
    const host = ref();
    watchEffect(() => (host.value = lobbystate.host.name));

    // 3 FUNKTIONEN zum ändern der änderbare Einstellungen:
    function changeKarte() {
      einstellungsfunktionen["changeKarte"](gewaehlteKarte.value);
    }
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
      kartenArray,
      istPrivat,
      changePrivacy,
      host,
      changeHost,
      startbuttonUnsichtbar,
      gewaehlteKarte,
      changeKarte,
    };
  },
});
</script>

<style scoped>
</style>
