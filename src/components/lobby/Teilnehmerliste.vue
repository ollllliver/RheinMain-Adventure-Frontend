<template>
  <div class="container">
    <div :teilnehmer="teilnehmer" v-for="teilnehmer in teilnehemrliste" :key="teilnehmer.id" class="col" >
        <img src="../../assets/user.png" alt="{{ teilnehmer.name }}"  width="100" height="100">
        <li>{{ teilnehmer.name }}</li>
    </div>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent } from "vue";
import { useLobbyStore } from "@/services/LobbyStore";

export default defineComponent({
  name: "Teilnehmerliste",

  props: {},
  setup() {
    const { lobbystate } = useLobbyStore();
    const angezeigteteilnehmer = computed(() => {
      return lobbystate.teilnehmerliste;
    });

    return {
      teilnehemrliste: angezeigteteilnehmer,
    };
  },
});
</script>
