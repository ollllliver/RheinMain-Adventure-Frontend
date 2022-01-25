<template>
  <div class="container">
    <div v-for="teilnehmer in teilnehemrliste" :key="teilnehmer.id" :teilnehmer="teilnehmer" class="col">
      <button v-if="lobbystate.host.name == userStore.state.benutzername && lobbystate.host.name != teilnehmer.name"
              class="btn btn-danger btn-sm" style="position: absolute;" @click="spielerEntfernen(teilnehmer)">X
      </button>
      <div v-html="generateProfilbild(teilnehmer.name)"></div>
      <li>{{ teilnehmer.name }}</li>
    </div>
  </div>
</template>


<script lang="ts">
import {computed, defineComponent} from "vue";
import {useLobbyStore} from "@/services/lobby/lobbyService";
import userStore from "@/stores/user";
import {toSvg} from "jdenticon";

export default defineComponent({
  name: "Teilnehmerliste",

  props: {},
  setup() {
    const {lobbystate, spielerEntfernen} = useLobbyStore();
    const angezeigteteilnehmer = computed(() => {
      return lobbystate.teilnehmerliste;
    });

    function generateProfilbild(user: string) {
      return toSvg(user, 100);
    }

    return {
      teilnehemrliste: angezeigteteilnehmer, spielerEntfernen, userStore, lobbystate, generateProfilbild,
    };
  },
});
</script>
