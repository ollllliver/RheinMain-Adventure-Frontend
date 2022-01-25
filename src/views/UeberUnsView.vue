<!-- Home View mit Login/Regestrieren Formular -->

<template>
  <div class="container">
      <br>
      <AboutText/>
      <br>
      <h2>Team</h2>
      <Team/>
      <br>
      <h2>Dozenten</h2>
      <Dozenten :personenListe="dozenten"/>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import Team from "@/components/about/Team.vue"
import Dozenten from "@/components/about/Dozenten.vue"
import AboutText from "@/components/about/AboutText.vue"
export default defineComponent({
  name: 'Home',
  components: { Team, AboutText, Dozenten },
  setup() {
    const dozenten = ["Prof. Dr. Wolfgang Weitz", "Dr. Thomas Quintus"]

    return { dozenten }
  }
});
</script>

<style scoped>

</style>
