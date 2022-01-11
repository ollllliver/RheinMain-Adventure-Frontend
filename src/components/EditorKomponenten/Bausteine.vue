<template>
  <!-- Bausteine: Info + Weg-/Start-/Zielbutton + draggable Raum-Bausteine + Raumausrichtungseinstellung -->
  <button
    class="btn btn-outline-secondary"
    :class="info"
    @click="info()"
    id="info"
  >i</button>
  <button
    class="btn btn-outline-secondary"
    :class="weg"
    @click="waehle($event, weg)"
    id="weg"
  >W</button>
  <button
    class="btn btn-outline-secondary"
    :class="start"
    @click="waehle($event, start)"
    id="start"
  >S</button>
  <button
    class="btn btn-outline-secondary"
    :class="ziel"
    @click="waehle($event, ziel)"
    id="ziel"
  >Z</button>
  <button
    class="btn btn-outline-secondary"
    draggable="true"
    @dragstart="startDrag($event, schluessel)"
    @click="setzeInfo(schluessel)"
    id="schluessel"
  ><img src="/img/schluessel.png" style="display: block; margin-left: auto; margin-right: auto"/>
  </button>
  <button
    class="btn btn-outline-secondary"
    draggable="true"
    @dragstart="startDrag($event, npc)"
    @click="setzeInfo(npc)"
    id="npc"
  ><img src="/img/npc.png" style="display: block; margin-left: auto; margin-right: auto"/>
  </button>
  <button
    class="btn btn-outline-secondary"
    draggable="true"
    @dragstart="startDrag($event, tuer)"
    @click="setzeInfo(tuer)"
    id="tuer"
  ><img src="/img/tuer-h.png" style="display: block; margin-left: auto; margin-right: auto"/>
  </button>
  <!-- Räume vorerst verschoben
    <button class="btn btn-outline-secondary" v-for="raum in raeume" :key="raum.id" draggable="true" 
    @dragstart="startDrag($event, raum)" @click="setzeInfo(raum)" id="räume"> R{{raum.title}} </button>
  -->
  <div
    class="btn-group btn-group-toggle"
    data-toggle="buttons"
    id="raumausrichtung"
  >
    <p class="ueberschrift">Tuerausrichtung</p>
    <label class="btn">
      <input
        type="radio"
        name="options"
        autocomplete="off"
        checked
        @click="ausrichten(0)"
      /><p class="beschreibung">horizontal</p>
    </label>
    <label class="btn">
      <input
        type="radio"
        name="options"
        autocomplete="off"
        @click="ausrichten(1)"
      /><p class="beschreibung">vertikal</p>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import editorStore from "../../stores/editor";

export default defineComponent({
  name: "Bausteine",
  setup() {
    const weg = 1;
    const start = 2;
    const ziel = 3;
    const schluessel = 4;
    const npc = 5;
    const tuer = 6;

    /*
    // Räume === vorerst verschoben
    const raeume = ref([
      {id:4, title:'1', rauminfo: 'In Raum 1 ist das Ziel einen versteckten Schlüssel zu finden.'+
      'Dieser ist hinter oder unter zufälligen Gegenständen im Raum versteckt.'+
      'Ist der Schlüssel gefunden kann damit eine Tür geöffnet werden und das Rätsel ist abgeschlossen'},
      {id:5, title:'2', rauminfo: 'In Raum 2 ist das Ziel, verschiedene Schalter zu aktivieren.'+
      'Die Schalter können verschiedene Formen und Farben haben. Sind alle Schalter gedrückt'+
      'öffnet sich die Tür.'},
      {id:6, title:'3', rauminfo: 'In Raum 3 ist das Ziel einen versteckten Schlüssel zu finden.'+
      'Dieser ist hinter oder unter zufälligen Gegenständen im Raum versteckt.'+
      'Ist der Schlüssel gefunden kann damit eine Tür geöffnet werden und das Rätsel ist abgeschlossen'},
      {id:7, title:'4', rauminfo: 'In Raum 4 ist das Ziel, verschiedene Schalter zu aktivieren.'+
      'Die Schalter können verschiedene Formen und Farben haben. Sind alle Schalter gedrückt'+
      'öffnet sich die Tür.'},
      {id:8, title:'5', rauminfo: 'In Raum 5 ist das Ziel, verschiedene Schalter zu aktivieren.'+
      'Die Schalter können verschiedene Formen und Farben haben. Sind alle Schalter gedrückt'+
      'öffnet sich die Tür.'},
    ])
    */

    // bei drag (Drag-and-Drop) Baustein kopieren und platzierbar machen
    const startDrag = (event: any, item: any) => {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "copy";
      /*event.dataTransfer.setData('itemID',item.id) fuer Räume*/
      event.dataTransfer.setData("itemID", item);
      //console.log(event.dataTransfer.getData('itemID'))
      editorStore.setze(9);
    };

    // Element waehlen das platziert werden soll (W = 0, S = 1, Z = 2)
    const waehle = (event: any, item: any) => {
      editorStore.setze(item);
    };

    // Infobox füllen
    const setzeInfo = (item: any) => {
      switch (item) {
        case 4:
          editorStore.info("Platziere einen Schluessel auf der Karte. Mit Schluesseln koennen Tuere geoeffnet werden. Bitte beachte das die Anzahl der Schluessel mit der Anzahl der Tueren uebereinstimmt.");
          break;
        case 5:
          editorStore.info("Platziere einen NPC auf der Karte. NPC geben dir Hinweise zu den versteckten Schluessel auf der Karte.");
          break;
        case 6:
          editorStore.info("Platziere eine Tuer auf der Karte. Standardausrichrtung ist horizontal, diese kann ueber die Auswahl veraendert werden. Bitte beachte das die Anzahl der Schluessel mit der Anzahl der Tueren uebereinstimmt.");
          break;
      }
      //editorStore.info(item.rauminfo)
    };

    // Anleitung über i in Infobox
    const info = () => {
      editorStore.info("Die Karte startet voller Wände. Mit Klick auf W, S oder Z kann das gewünschte Element auf der Karte per Mausklick eingezeichnet werden. Die weiteren Bausteine sind platzierbare Elemente die über Drag-and-Drop auf die Karte gezogen werden können. Die Tueren können über die Auswahl entweder horizontal oder vertikal platziert werden.");
    };

    // Ausrichtung des Raums bestimmen
    const ausrichten = (richtung: number) => {
      editorStore.ausrichten(richtung);
      switch (richtung) {
        case 0: {
          editorStore.info("Tuere werden jetzt horizontal platziert.");
          break;
        }
        case 1: {
          editorStore.info("Tuere werden jetzt vertikal platziert.");
          break;
        }
      }
    };

    return {
      /*raeume,*/ startDrag,
      waehle,
      setzeInfo,
      ausrichten,
      weg,
      start,
      ziel,
      info,
      tuer,
      schluessel,
      npc,
    };
  },
});
</script>

<style scoped>
button {
  margin: 10px;
  width: 40px;
  height: 30px;
}
#räume {
  background-color: rgb(245, 199, 192);
  color: black;
}
.ueberschrift {
  font-size: 10px;
  margin: 0 auto;
  margin-left: 25px;
  margin-top: 10px;
}
.beschreibung {
  font-size: 10px;
  margin: 0px;
}
#raumausrichtung {
  margin-right: -30px;
  margin-left: 30px;
  display: inline-table;
}
#info {
  border-style: dotted;
  border-radius: 50px;
  margin-left: -20px;
  margin-right: 60px;
  width: 25px;
  padding: 2px;
  background-color: rgb(248, 251, 252);
  color: black;
}
#weg {
  background-color: rgba(255, 247, 210, 0.87);
  color: black;
}
#start {
  background-color: rgba(228, 255, 197, 0.87);
  color: black;
}
#ziel {
  background-color: rgba(210, 222, 255, 0.87);
  color: black;
}
</style>
