<template>
  <div class="container">
    <div class="d-flex flex-wrap">
      <div v-for="person in personen" :key="person" :person="person" class="teilnehmer">
        <div class="d-flex justify-content-center" v-html="generateProfilbild(person)"></div>
        <strong class="d-flex justify-content-center" style="text-align: center;">{{ person }}</strong>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {defineComponent} from "vue";
import {toSvg} from "jdenticon";

export default defineComponent({
  name: "Dozenten",

  props: {
    personenListe: {
      required: true,
      type: Array
    }
  },
  setup(props) {
    function generateProfilbild(user: string) {
      return toSvg(user, 100);
    }

    return {
      personen: props.personenListe, generateProfilbild,
    };
  },
});
</script>

<style>

.teilnehmer {
  width: 150px;
  height: 150px;
}
</style>
