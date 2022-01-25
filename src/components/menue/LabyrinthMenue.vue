<template>
  <div class="container">
    <svg class="p-1" viewBox="-10 -10 1420 820" width="50%">

      <!-- Rahmen -->
      <polyline class="wand path" points="0,0 1400,0 1400,800 0,800 0,100"/>

      <!-- Mauern -->
      <polyline class="wand path" points="0,0 100,0 100,100 300,100 300,200 500,200 500,100"/>
      <polyline class="wand path" points="0,0 400,0 400,100"/>
      <polyline class="wand path" points="0,0 1400,0 1400,800 0,800 0,200 200,200"/>
      <polyline class="wand path"
                points="0,0 1400,0 1400,800 1200,800 1200,500 500,500 500,300 100,300 100,500 400,500 400,400 200,400"/>
      <polyline class="wand path"
                points="0,0 1400,0 1400,800 1200,800 1200,500 500,500 500,700 300,700 300,600 100,600 100,700"/>
      <polyline class="wand path"
                points="0,0 1400,0 1400,800 1200,800 1200,500 500,500 500,700 300,700 300,600 400,600"/>
      <polyline class="wand path"
                points="0,0 1400,0 1400,800 1200,800 1200,500 500,500 500,700 800,700 800,600 600,600"/>
      <polyline class="wand path" points="0,0 1400,0 1400,800 200,800 200,700"/>
      <polyline class="wand path" points="0,0 1400,0 1400,800 900,800 900,600 1100,600 1100,700"/>
      <polyline class="wand path" points="0,0 1400,0 1400,800 1000,800 1000,700"/>
      <polyline class="wand path" points="0,0 1400,0 1400,800 1200,800 1200,700 1300,700"/>
      <polyline class="wand path" points="0,0 1400,0 1400,500 1400,500 1300,500 1300,600"/>
      <polyline class="wand path" points="0,0 600,0 600,400 800,400"/>
      <polyline class="wand path" points="0,0 600,0 600,200 700,200"/>
      <polyline class="wand path" points="0,0 900,0 900,100 700,100"/>
      <polyline class="wand path" points="0,0 1200,0 1200,200 800,200"/>
      <polyline class="wand path" points="0,0 1200,0 1200,200 1000,200 1000,100 1100,100"/>
      <polyline class="wand path" points="0,0 1200,0 1200,200 900,200 900,300 700,300"/>
      <polyline class="wand path" points="0,0 1200,0 1200,200 900,200 900,400 1200,400 1200,300 1000,300"/>
      <polyline class="wand path" points="0,0 1200,0 1200,200 900,200 900,400 1300,400 1300,100"/>

      <!-- ABOUT -->
      <a class="POI" href="/#/about">
        <text href="#" x="930" y="375">Über uns</text>
      </a>
      <polyline class="wand"
                points="0,50 50,50 50,150 250,150 250,250 550,250 550,450 1350,450 1350,50 1250,50 1250,250 950,250 950,310"/>

      <!-- HOWTO -->
      <a class="POI" href="/#/anleitung">
        <text href="#" x="520" y="675">Anleitung</text>
      </a>
      <polyline class="wand"
                points="0,50 50,50 50,150 250,150 250,250 50,250 50,750 150,750 150,650 250,650 250,750 850,750 850,550 550,550 550,620"/>

      <!-- EDITORÜBERSICH -->
      <a v-if="angemeldet" class="POI" href="/#/editoruebersicht">
        <text href="#" x="200" y="475">Editor</text>
      </a>
      <polyline v-if="angemeldet" class="wand"
                points="0,50 50,50 50,150 250,150 250,250 50,250 50,550 450,550 450,350 150,350 150,450 190,450"/>

      <!-- PLAY -->
      <a v-if="angemeldet" class="POI" href="/#/uebersicht">
        <text href="#" x="680" y="75">Spielen</text>
      </a>
      <polyline v-if="angemeldet" class="wand"
                points="0,50 50,50 50,150 250,150 250,250 550,250 550,450 850,450 850,350 650,350 650,250 750,250 750,150 650,150 650,50 670,50"/>

      <!-- ITEMS -->
      <!-- Key -->
      <image :class="key" alt="" height="80" href="@/assets/img/maze-items/key.svg" width="80" x="1010"
             y="110" @click="keyClick"/>
      <polyline class="wand"
                points="0,50 50,50 50,150 250,150 250,250 550,250 550,450 850,450 850,350 650,350 650,250 750,250 750,150 950,150 950,50 1150,50 1150,150 1100,150"/>

      <!-- Closed Door -->
      <image :class="cDoor" alt="" height="80" href="@/assets/img/maze-items/closed-door.svg" width="80" x="1310"
             y="710" @click="cDoorClick"/>
      <polyline class="wand"
                points="0,50 50,50 50,150 250,150 250,250 550,250 550,450 1250,450 1250,650 1350,650 1350,700"/>

      <!-- Open Door -->
      <a target="__blank" xlink:href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
        <image :class="oDoor" alt="" height="80" href="@/assets/img/maze-items/opened-door.svg" width="80" x="1310"
               y="710" @click="oDoorClick"/>
        <polyline class="wand"
                  points="0,50 50,50 50,150 250,150 250,250 550,250 550,450 1250,450 1250,650 1350,650 1350,700"/>
      </a>

      <!-- Tupel -->
      <image alt="" class="POI" height="180" href="@/assets/img/maze-items/tupel.svg" width="180" x="860"
             y="620" @click="tupelClick"/>
      <polyline class="wand"
                points="0,50 50,50 50,150 250,150 250,250 50,250 50,750 150,750 150,650 250,650 250,750 850,750 850,550 1150,550 1150,750 1050,750 1050,650 1000,650"/>

    </svg>

    <div :class="popup">
      <span class="helper"></span>
      <div>
        <div class="popupCloseButton" @click="hidePopup">&times;</div>
        <strong>Tupel hat eine Frage!</strong>
        <p>Was ist 7 mal sieben?</p>
        <div class='d-flex justify-content-around'>
          <button class="btn btn-secondary" @click='antwortClick'>49</button>
          <button class="btn btn-secondary" @click='antwortClick'>Feiner Sand</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "MazeMenue",

  props: {},
  setup() {
    const key = ref('shown POI');
    const cDoor = ref('shown POI');
    const oDoor = ref('hidden POI');
    const popup = ref('hidden POI');
    let tupel = false;

    function keyClick() {
      key.value = 'hidden POI';
    }

    function cDoorClick() {
      if (key.value == 'hidden POI' && tupel) {
        cDoor.value = 'hidden POI';
        oDoor.value = 'shown POI';
      }
    }

    function oDoorClick() {
      console.log('GESCHAFFT! JEY!')
    }

    function tupelClick() {
      if (!tupel) {
        popup.value = 'popup';
      }
    }

    function hidePopup() {
      popup.value = 'hidden';
    }

    function antwortClick() {
      hidePopup();
      tupel = true;
    }

    // TODO: wenn angemeldet dann angemeldet auf true
    return {
      angemeldet: true,
      key, cDoor, oDoor,
      keyClick,
      cDoorClick,
      oDoorClick,
      tupelClick,
      hidePopup,
      antwortClick,
      popup,
    };
  },
});
</script>

<style>
.wand {
  fill: none;
  stroke: #6d9466;
  stroke-width: 8;
}

.path {
  stroke-dasharray: 500%;
  stroke-dashoffset: 500%;
  animation: dash 1.5s linear forwards;
}

@keyframes dash {
  to {
    stroke-dashoffset: 10%;
  }
}

.POI {
  text-decoration: none;
}

.POI + polyline {
  display: none;
  fill: none;
  stroke-width: 10;
  stroke: #eeb258;
}

.POI:hover + polyline {
  display: inline;
  stroke-dasharray: 400%;
  stroke-dashoffset: 400%;
  animation: dash 1s linear forwards;
}

text {
  font-size: 3.5em;
  font-weight: 700;
}

.hidden {
  display: none;
}

/* ######### Popup box ######### */
.popup {
  background: rgba(0, 0, 0, .4);
  cursor: pointer;
  height: 100%;
  position: fixed;
  text-align: center;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
}

.popup .helper {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.popup > div {
  background-color: #fff;
  box-shadow: 10px 10px 60px #555;
  display: inline-block;
  height: auto;
  max-width: 551px;
  min-height: 100px;
  vertical-align: middle;
  width: 60%;
  position: relative;
  border-radius: 8px;
  padding: 15px 5%;
}

.popupCloseButton {
  background-color: #fff;
  border: 1px solid #999;
  border-radius: 50px;
  cursor: pointer;
  display: inline-block;
  font-family: arial;
  font-weight: bold;
  position: absolute;
  top: -12px;
  right: -12px;
  font-size: 30px;
  line-height: 30px;
  width: 30px;
  height: 30px;
  text-align: center;
}

.popupCloseButton:hover {
  background-color: #ccc;
  color: red;
}

/* ######### Popup box ######### */

</style>
