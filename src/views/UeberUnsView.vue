<!-- Home View mit Login/Regestrieren Formular -->

<template>
  <div class="container">
      <br>
      <AboutText/>
      <br>
      <h2>Team</h2>
      <Team :personenListe="mitwirkende"/>
      <br>
      <h2>Dozenten</h2>
      <Team :personenListe="dozenten"/>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import Team from "@/components/about/Team.vue"
import AboutText from "@/components/about/AboutText.vue"
export default defineComponent({
  name: 'Home',
  components: { Team, AboutText },
  setup() {
    const  mitwirkende = ["Andreas Leipe", "Chand Mandru", "Friedrich Roskosch", "Hans Lakos", "Julian Gräber", "Lukas Lambertz", "Marvin Lindner", "Oliver Renth", "Pakisa Naurozi", "Raoul Sudiana", "Timothy Tjong-Ayong"];
    const dozenten = ["Prof. Dr. Wolfgang Weitz", "Dr. Thomas Quintus"]

    return { mitwirkende, dozenten }
  }
});
</script>

<style scoped>

</style>
