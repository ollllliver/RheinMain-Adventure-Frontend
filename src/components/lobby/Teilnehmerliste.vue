<template>
  <div class="container">
    <div :teilnehmer="teilnehmer" v-for="teilnehmer in teilnehemrliste" :key="teilnehmer.id" class="col" >
      <button v-if="lobbystate.host.name == userStore.state.benutzername && lobbystate.host.name != teilnehmer.name"
        class="btn btn-danger btn-sm" style="position: absolute;" @click="spielerEntfernen(teilnehmer)">X</button>
      <img src="../../assets/user.png" alt="{{ teilnehmer.name }}"  width="100" height="100">
      <li>{{ teilnehmer.name }}</li>
    </div>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent } from "vue";
import { useLobbyStore } from "@/services/LobbyStore";
import userStore from "@/stores/user";

export default defineComponent({
  name: "Teilnehmerliste",

  props: {},
  setup() {
    const { lobbystate, spielerEntfernen } = useLobbyStore();
    const angezeigteteilnehmer = computed(() => {
      return lobbystate.teilnehmerliste;
    });

    return {
      teilnehemrliste: angezeigteteilnehmer, spielerEntfernen, userStore, lobbystate,
    };
  },
});
</script>
