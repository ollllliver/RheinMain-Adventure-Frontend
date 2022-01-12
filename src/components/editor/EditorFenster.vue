<template>
  <!--
        Grid-Anzeige der Karte (drop-zone aus karte.liste[]) 
        klickbare divs für Wegeinzeichnung und Start/Ziel Platzierung + drag-and-drop der Bausteine
    -->

  <div class="drop-zone" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
    <div v-for="row in liste" :key="row.value" class="reihe" draggable="false">
      <div
        v-for="col in row"
        :key="col"
        v-bind="col.id"
        class="element"
        v-on:click="wegPunkt"
        draggable="false"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { CommandStack } from "../../commands/CommandManager";
import {ElementHinzufuegen} from "../../commands/ElementeHinzufuegenCommand.ts"
import editorStore from "@/stores/editor";

export default defineComponent({
  name: "Editorfenster",
  setup() {
    // Kartenklasse mit liste als Array aus editorStore
    var karte = editorStore.getters.getGrid
    const liste = karte.liste

    /**
     * bei drop (Drag-and-Drop) Raum auf der Karte platzieren
     * wenn Raum auf platzierte Stelle passt
     * über Command auf der Karte platzieren -> Platzierung in Command-Klasse
     */
    const onDrop = (event: any) => {
      const itemID = parseInt(event.dataTransfer.getData("itemID"));
      console.log(itemID,'itemID Editorfenster')
      // wenn an der Stelle ein Weg ist
      if(liste[event.target.__vnode.key.y][event.target.__vnode.key.x].e === 1) {
        CommandStack.getInstance().execAndPush(new ElementHinzufuegen(karte, itemID, event, editorStore.getters.getAusrichtung));
        editorStore.setze(0);
        return;
      } else {
        editorStore.info("Um dieses Element platzieren zu können muss vorher ein Wegpunkt an der Stelle sein.")
      }
      
      
      /* Raum Platzierung ====== vorerst aufgeschoben
        
        // wenn horizontaler Raum   
        if (editorStore.getters.getAusrichtung === 0) {
            // Wenn gültiger Bereich (Raum passt auf Karte und überschneidet nicht mit anderen Elementen)
            if (event.target.__vnode.key.y - 1 >= 0 &&
            event.target.__vnode.key.x - 1 >= 0 && event.target.__vnode.key.x + 1 < 22) {
                if(liste[event.target.__vnode.key.y][event.target.__vnode.key.x].e === 0 &&
                liste[event.target.__vnode.key.y][event.target.__vnode.key.x + 1].e === 0 &&
                liste[event.target.__vnode.key.y][event.target.__vnode.key.x - 1].e === 0 &&
                liste[event.target.__vnode.key.y - 1][event.target.__vnode.key.x].e === 0 && 
                liste[event.target.__vnode.key.y - 1][event.target.__vnode.key.x + 1].e === 0 &&
                liste[event.target.__vnode.key.y - 1][event.target.__vnode.key.x - 1].e === 0) {
                    CommandStack.getInstance().execAndPush(new ElementHinzufuegen(karte, itemID, event, editorStore.getters.getAusrichtung));
                    editorStore.setze(0);
                    return;
                }
            } 
           editorStore.info("Raum passt nicht auf diese Position. Ein horizontaler Raum besteht 2 x 3 Felder. Bitte wähle einen passenden Ort aus.");
        // wenn vertikaler Raum
        } else if (editorStore.getters.getAusrichtung === 1){
            // Wenn gültiger Bereich (Raum passt auf Karte und überschneidet nicht mit anderen Elementen)
            if (event.target.__vnode.key.y - 1 >= 0 &&  event.target.__vnode.key.y + 1 < 14 &&
            event.target.__vnode.key.x - 1 >= 0) {
                if(liste[event.target.__vnode.key.y][event.target.__vnode.key.x].e === 0 &&
                liste[event.target.__vnode.key.y][event.target.__vnode.key.x - 1].e === 0 &&
                liste[event.target.__vnode.key.y + 1][event.target.__vnode.key.x].e === 0 &&
                liste[event.target.__vnode.key.y - 1][event.target.__vnode.key.x].e === 0 && 
                liste[event.target.__vnode.key.y - 1][event.target.__vnode.key.x - 1].e === 0 &&
                liste[event.target.__vnode.key.y + 1][event.target.__vnode.key.x - 1].e === 0) {
                    CommandStack.getInstance().execAndPush(new ElementHinzufuegen(karte, itemID, event, editorStore.getters.getAusrichtung));
                    editorStore.setze(0);
                    return;
                }
            }
            editorStore.info("Raum passt nicht auf diese Position. Ein vertikaler Raum besteht 3 x 2 Felder. Bitte wähle einen passenden Ort aus.");
        }


        */
    };
    onMounted(() => {
      console.log(liste)
    });

    /**
     * Wegpunkt markieren:
     * wenn seine Wegbeschreibung (Weg/Start/Ziel) gesetzt ist
     * wenn an dieser Stelle noch kein Element platziert wurder
     * über Command auf der Karte platzieren -> Platzierung in Command-Klasse
     */
    const wegPunkt = (event: any) => {
      if (editorStore.getters.istAktiv) {
        if (editorStore.getters.getElement === 2) {
          if (editorStore.getters.getStart) {
            editorStore.info(
              "Start bereits gesetzt. Es gibt nur einen Startpunkt"
            );
            return;
          }
        }
        if (editorStore.getters.getElement === 3) {
          if (editorStore.getters.getZiel) {
            editorStore.info("Ziel bereits gesetzt. Es gibt nur ein Ziel");
            return;
          }
        }
        if (
          liste[event.target.__vnode.key.y][event.target.__vnode.key.x].e === 0
        ) {
          CommandStack.getInstance().execAndPush(
            new ElementHinzufuegen(karte, editorStore.getters.getElement, event)
          );
        } else {
          editorStore.info(
            "Stelle bereits belegt. Bitte vorher löschen oder an anderer Position belegen!"
          );
        }
      } else {
        editorStore.info("Bitte wähle erst ein Baustein aus!");
      }
    };
    return {
      onDrop,
      liste,
      wegPunkt,
    };
  },
});
</script>

<style scoped>
html,
body {
  height: 100%;
}

.drop-zone {
  height: 100%;
  width: 100%;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  margin: 0;
}
.reihe {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
}
.element {
  float: left;
  box-sizing: border-box;
  width: 36.09px;
  height: 35.428px;
  border: 1px solid rgb(0, 0, 0);
  background-color: rgba(92, 92, 92, 0.658);
}
</style>