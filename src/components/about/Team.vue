<template>
  <div class="container">
    <div class="d-flex flex-wrap">
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Andreas_Leipe.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Andreas Leipe</strong>
      </div>
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Chand_Mandru.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Chand Mandru</strong>
      </div>
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Friedrich_Roskosch.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Friedrich Roskosch</strong>
      </div>
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Hans_Lakos.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Hans Lakos</strong>
      </div>
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Julian_Gräber.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Julian Gräber</strong>
      </div>
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Lukas_Lambertz.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Lukas Lambertz</strong>
      </div>
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Marvin_Lindner.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Marvin Lindner</strong>
      </div>
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Oliver_Renth.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Oliver Renth</strong>
      </div>
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Pakisa_Naurozi.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Pakisa Naurozi</strong>
      </div>
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Raoul_Sudiana.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Raoul Sudiana</strong>
      </div>
      <div class="teilnehmer">
        <div class="d-flex justify-content-center">
          <img alt="" height="100" src="@/assets/img/avatare/Timothy_Tjong-Ayong.png">
        </div>
        <strong class="d-flex justify-content-center" style="text-align: center;">Timothy Tjong-Ayong</strong>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Teilnehmerliste",
  setup() {
    return {};
  },
});
</script>

<style>

.teilnehmer {
  width: 150px;
  height: 150px;
}
</style>
