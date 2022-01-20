<template>
  <div id="zielFenster">
    <div class="fenster__inner">
      <div class="fenster__top">
        <h1 class="title">{{ titel }}</h1>
      </div>
      <div :class="fenster__frage">
        <button class="button" @click="falsch">{{ shuffleAntworten() }}</button
        ><br />
        <button class="button" @click="richtig">{{ buttonString }}</button
        ><br />
        <button class="button" @click="falsch">{{ shuffleAntworten() }}</button
        ><br />
      </div>
      <div :class="fenster__beende">
        <button class="button" @click="beenden">Kehre Zurück zur Lobby</button
        ><br />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLobbyStore } from "@/services/lobby/lobbyService";

export default defineComponent({
  setup() {
    const { beendeSpiel } = useLobbyStore();
    const fenster__frage = ref('fenster__frage')
    const fenster__beende = ref('fenster__beende');
    fenster__beende.value = 'hidden';

    let titel: string;
    let byteString: string;
    let buttonString: string;
    let counter: number;

    counter = 0;
    byteString = "";

    for (let i = 1; i <= 8; i = i * 2) {
      let rnd = getRandomInt(0, 1);
      byteString = byteString + rnd.toString();
      if (rnd !== 0) {
        counter += i;
      }
    }

    titel = "Welche Dezimalzahl befindet sich hier hinter -> " + byteString;
    buttonString = counter.toString();

    function shuffleAntworten(): string {
      let rndNumb = getRandomInt(0, 15);
      do {
        rndNumb = getRandomInt(0, 15);
      } while (rndNumb === counter);
      return rndNumb.toString();
    }

    function aktualisiereFenster() {
      fenster__frage.value = 'hidden'
      fenster__beende.value = 'block'
    }

    function getRandomInt(min: number, max: number): number {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
      beendeSpiel,
      shuffleAntworten,
      aktualisiereFenster,
      fenster__frage,
      fenster__beende,
      buttonString,
      titel,
    };
  },
  methods: {
    richtig() {
      this.titel = "Richtig! Ihr habt das Spiel gewonnen";
      this.aktualisiereFenster();
    },
    falsch() {
      this.titel = "Falsch! Ihr habt das Spiel leider verloren";
      this.aktualisiereFenster();
    },
    beenden() {
      this.beendeSpiel();
    },
  },
});
</script>

<style>
.fenster__none {
  display: none;
}

.fenster__inner {
  background: #c0c0c0;
  width: 100%;
  max-width: 800px;
  overflow: hidden;
  border-radius: 4px;
}

.fenster__top {
  display: flex;
  align-items: center;
  background-color: #eeeeee;
  text-align: center;
}

.title {
  flex-grow: 1;
  padding: var(--gap) var(--gap) 0 var(--gap);
  font-size: 20px;
  /* color: #fff; */
}

.fenster__frage {
  text-align: center;
  padding: var(--gap) var(--gap) var(--gap) var(--gap);
}

.fenster__beende {
  text-align: center;
  padding: var(--gap) var(--gap) var(--gap) var(--gap);
}

.button {
  display: inline-block;
  padding: 6px 12px;
  background: #ffffff;
  border: none;
  outline: none;
  border-radius: 3px;
  color: #000000;
  cursor: pointer;
  font-size: 18px;
  width: 150px;
  margin: 2px;
}

.button:hover {
  background: #e4e4e4;
}
</style>
