<template>
  <div class="container">
    <div class="d-flex flex-wrap">
      <div :person="person" v-for="person in personen" :key="person" class="teilnehmer" >
        <div v-html="generateProfilbild(person)" class="d-flex justify-content-center" ></div>
        <strong class="d-flex justify-content-center" style="text-align: center;">{{ person }}</strong>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { toSvg } from "jdenticon";

export default defineComponent({
  name: "Teilnehmerliste",

  props: {
    personenListe:{
      required: true,
      type: Array
    }
  },
  setup(props) {
    function generateProfilbild(user) {
      return toSvg(user, 100);
    }
    
    return {
      personen: props.personenListe, generateProfilbild,
    };
  },
});
</script>

<style>

  .teilnehmer{
    width: 150px;
    height: 150px;
  }
</style>
