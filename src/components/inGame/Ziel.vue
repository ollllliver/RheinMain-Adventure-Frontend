<template>
  <div id="zielFenster">
    <div class="fenster__inner">
      <div class="fenster__top">
        <h1 class="title">{{ titel }}</h1>
        <div :class="close__button" @click="schließen()">&times;</div>
        <span class="helper"></span>
      </div>
      <div :class="fenster__frage">
        <input
          id="antwortInput"
          class="text__input"
          v-model="eingabe.antwort"
          v-on:keyup.enter="beantworten()"
          required
        />
        <button class="ok__button" @click="beantworten()">Ok</button>
      </div>
      <div :class="fenster__beende">
        <button class="beenden__button" @click="beenden">Spiel beenden</button><br />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useGameEngine } from "@/services/inGame/gameEngine";
import { useLobbyStore } from "@/services/lobby/lobbyService";

export default defineComponent({
  setup() {
    const { beendeSpiel } = useLobbyStore();
    const { connect, disconnect } = useGameEngine();

    const eingabe = reactive({ antwort: "" });
    const close__button = ref("close__button");
    const fenster__inner = ref("fenster__inner");
    const fenster__frage = ref("fenster__frage");
    const fenster__beende = ref("hidden");

    let titel: string;
    let byteString: string;
    let loesung: number;

    loesung = 0;
    byteString = "";

    /**
     * Hier wird der Binärwert für die Frage
     * mit der dazu gehörigen Dezimalzahl generiert
     */
    for (let i = 1; i <= 8; i = i * 2) {
      let rnd = getRandomInt(0, 1);
      byteString = byteString + rnd.toString();
      if (rnd !== 0) {
        loesung += i;
      }
    }

    getReverseString(byteString);
    titel = "Welche Zahl befindet sich hinter diesem Binärwert? -> " + byteString;

    function aktualisiereFenster() {
      close__button.value = "hidden";
      fenster__frage.value = "hidden";
      fenster__beende.value = "fenster__beende";
    }

    function versteckeFenster() {
      fenster__inner.value = "hidden";
    }

    function getReverseString(str: string) {
      let stringArray = str.split("");
      byteString = stringArray.reverse().join("");
    }

    function getRandomInt(min: number, max: number): number {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
      beendeSpiel,
      aktualisiereFenster,
      versteckeFenster,
      connect,
      disconnect,
      fenster__inner,
      fenster__frage,
      fenster__beende,
      close__button,
      byteString,
      eingabe,
      loesung,
      titel,
    };
  },
  methods: {
    beantworten() {
      this.disconnect();
      if (this.eingabe.antwort === this.loesung.toString()) {
        this.titel = "Richtig! Ihr habt das Spiel gewonnen";
        this.aktualisiereFenster();
      } else {
        this.titel = "Falsch! Ihr habt das Spiel leider verloren";
        this.aktualisiereFenster();
      }
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
.helper {
  display: inline-block;
  width: 1%;
  vertical-align: middle;
}

.hidden {
  display: none;
}

.title {
  flex-grow: 1;
  padding: var(--gap) var(--gap) 0 var(--gap);
  font-size: 20px;
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

.ok__button {
  display: inline-block;
  background: #ffffff;
  border: none;
  outline: none;
  border-radius: 3px;
  color: #000000;
  cursor: pointer;
  font-size: 18px;
  width: 40px;
  height: 30px;
  margin: 3px;
  text-align: center;
}

.beenden__button {
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

.beenden__button:hover,
.ok__button:hover {
  background: #e4e4e4;
}

.close__button {
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

.close__button:hover {
  background-color: #ccc;
  color: red;
}

.text__input {
  width: 50px;
}
</style>
