<template>
  <div id="zielFenster">
    <div class="fenster__inner">
      <div class="fenster__top">
        <h1 class="title">{{ titel }}</h1>
        <div :class="closeButton" @click="schließen()">&times;</div>
        <span class="helper"></span>
      </div>
      <div :class="fenster__frage">
        <button class="button" @click="falsch">{{ shuffleAntworten() }}</button>
        <button class="button" @click="richtig">{{ buttonString }}</button>
        <button class="button" @click="falsch">{{ shuffleAntworten() }}</button>
      </div>
      <div :class="fenster__beende">
        <button class="button" @click="beenden">Spiel beenden</button
        ><br />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useGameEngine } from "@/services/inGame/gameEngine";
import { useLobbyStore } from "@/services/lobby/lobbyService";

export default defineComponent({
  setup() {
    const { beendeSpiel } = useLobbyStore();
    const { connect, disconnect, disconnectController } = useGameEngine();
    
    const closeButton = ref('closeButton');
    const fenster__inner = ref('fenster__inner');
    const fenster__frage = ref('fenster__frage');
    const fenster__beende = ref('hidden');

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
      closeButton.value = 'hidden';
      fenster__frage.value = 'hidden';
      fenster__beende.value = 'fenster__beende';
    }

    function versteckeFenster() {
      fenster__inner.value = 'hidden';
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
      versteckeFenster,
      connect,
      disconnect,
      disconnectController,
      fenster__inner,
      fenster__frage,
      fenster__beende,
      closeButton,
      buttonString,
      titel,
    };
  },
  methods: {
    richtig() {
      this.titel = "Richtig! Ihr habt das Spiel gewonnen";
      this.disconnect();
      this.aktualisiereFenster();
    },
    falsch() {
      this.titel = "Falsch! Ihr habt das Spiel leider verloren";
      this.disconnect();
      this.aktualisiereFenster();
    },
    schließen() {
      this.versteckeFenster();
      this.connect();
    },
    beenden() {
      this.beendeSpiel();
    },
  },
});
</script>

<style>
.helper{
  display:inline-block;
  width: 1%;
  vertical-align:middle;
}

.hidden{
  display: none;
}

.title {
  flex-grow: 1;
  padding: var(--gap) var(--gap) 0 var(--gap);
  font-size: 20px;
  /* color: #fff; */
}

.button:hover {
  background: #e4e4e4;
}

.closeButton {
    background-color: #fff;
    border: 1px solid #999;
    border-radius: 50px;
    cursor: pointer;
    display: inline-block;
    font-family: arial;
    font-weight: bold;
    font-size: 30px;
    line-height: 30px;
    width: 30px;
    height: 30px;
    text-align: center;
}
.closeButton:hover {
    background-color: #ccc;
    color: red;
}

.fenster__inner {
  background: #c0c0c0;
  width: 100%;
  max-width: 800px;
  overflow: hidden;
  border-radius: 4px;
}

.fenster__top {
  align-items: center;
  background-color: #eeeeee;
  text-align: center;
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
</style>
