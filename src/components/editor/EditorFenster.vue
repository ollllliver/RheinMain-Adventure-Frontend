<template>
  <!--
        Grid-Anzeige der Karte (drop-zone aus karte.liste[]) 
        klickbare divs für Wegeinzeichnung und Start/Ziel Platzierung + drag-and-drop der Bausteine
    -->

  <div class="drop-zone" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
    <div v-for="(row, index) in liste" :key="index" class="reihe" draggable="false">
      <div
        v-for="col in row"
        :key="col"
        v-bind:id="col.id"
        class="element"
        v-on:click="wegPunkt"
        draggable="false"
        
      > {{col}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { CommandStack } from "../../commands/CommandManager";
import { ElementHinzufuegenCommand } from "../../commands/ElementHinzufuegenCommand";
import { ElementEntfernenCommand } from "../../commands/ElementEntfernenCommand";
import editorStore from "@/stores/editor";

export default defineComponent({
  name: "Editorfenster",
  setup() {


    // Kartenklasse mit liste als Array aus editorStore
    var karte: any;
    var liste: any[][];    
    karte = editorStore.getters.getGrid;

    // Proxy aufloesen?? das war zumindest mein Ziel
    const target_copy1 = Object.assign({}, karte);
    liste = Object.assign({}, target_copy1.levelInhalt);
    
    onMounted(() => {
      
      CommandStack.getInstance().reset()
      /**
       * durch liste iterieren und grid fuellen wenn bearbeitet
       * über document div elemente aus dem grid identifizieren
       */
      
      let reihe = document.getElementsByClassName("reihe")

      for (let y = 0 ; y < 14; y++) {
        for(let x = 0; x < 22; x++) {
          let spalte = reihe[y].getElementsByClassName("element")
          let element = spalte[x] as HTMLDivElement

          switch (liste[y][x].e) {
            case 1:
              element.style.backgroundColor = "#ffd39bBF"
              break;
            case 2:
              editorStore.start(true)
              element.style.backgroundColor = "#25bb1fA6"
              break;
            case 3:
              editorStore.ziel(true)
              element.style.backgroundColor = "#131ec4A6"
              break;
            case 4:
              editorStore.setzeSchluessel(1)
              element.style.background = "no-repeat center url('../img/schluessel.png') rgba(255,211,155, 0.75)"
              break;
            case 5:
              editorStore.setzeNpc(1)
              element.style.background = "no-repeat center url('../img/npc.png') rgba(255,211,155, 0.75)"
              break;
            case 6:
              editorStore.setzeTuer(1)
              element.style.background = "no-repeat center url('../img/tuer-h.png') rgba(255,211,155, 0.75)"
              break;
            case 7: 
              editorStore.setzeTuer(1)
              element.style.background = "no-repeat center url('../img/tuer-v.png') rgba(255,211,155, 0.75)"
              break;
          }
        }
      }
    });

    
    /**
     * bei drop (Drag-and-Drop) Elemnent auf der Karte platzieren
     * itemdID, y-, x-Koordinaten und element über event identifizieren
     * über Command auf der Karte platzieren -> Platzierung in Command-Klasse
     */
    const onDrop = (event: any) => {
      const itemID = parseInt(event.dataTransfer.getData("itemID"));
      const y = parseInt(event.target.innerText.replace(/\s/g, "").split(",",3)[0].split(":",2)[1])
      const x = parseInt(event.target.innerText.replace(/\s/g, "").split(",",3)[1].split(":",2)[1])
      const e = parseInt(event.target.innerText.replace(/\s/g, "").split(",",3)[2].split(":",2)[1].split("}",1)[0])
      const ele = {y:y,x:x,e:e}

      // wenn an der Stelle ein Weg ist
      if (liste[ele.y][ele.x].e === 1) {
        CommandStack.getInstance().execAndPush(
          new ElementHinzufuegenCommand(
            karte,
            itemID,
            editorStore.getters.getStackindex,
            event,
            ele,
            editorStore.getters.getAusrichtung
          )
        );
        editorStore.setze(0);
        return;
      } else {
        editorStore.info("Um dieses Element platzieren zu können muss vorher ein Wegpunkt an der Stelle sein.");
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
    

    /**
     * Wegpunkt markieren:
     * wenn seine Wegbeschreibung (Weg/Start/Ziel) gesetzt ist
     * wenn an dieser Stelle noch kein Element platziert wurde
     * über Command auf der Karte platzieren -> Platzierung in Command-Klasse
     */
    const wegPunkt = (event: any) => {
      
      if (editorStore.getters.istAktiv) {
        if (editorStore.getters.getElement === 2) {
          if (editorStore.getters.getStart) {
            editorStore.info("Start bereits gesetzt. Es gibt nur einen Startpunkt");
            return;
          }
        }
        if (editorStore.getters.getElement === 3) {
          if (editorStore.getters.getZiel) {
            editorStore.info("Ziel bereits gesetzt. Es gibt nur ein Ziel");
            return;
          }
        }

        if (editorStore.getters.getEntfernen) {
          
          // y-, x-Koordinaten und element ueber event identifizieren
          const y = parseInt(event.target.innerText.replace(/\s/g, "").split(",",3)[0].split(":",2)[1])
          const x = parseInt(event.target.innerText.replace(/\s/g, "").split(",",3)[1].split(":",2)[1])
          const e = parseInt(event.target.innerText.replace(/\s/g, "").split(",",3)[2].split(":",2)[1].split("}",1)[0])
          
          const ele = {y:y,x:x,e:e}
          if (liste[y][x]!== 0) {
            CommandStack.getInstance().execAndPush(
              new ElementEntfernenCommand(
                karte,
                e,
                editorStore.getters.getStackindex,
                event,
                ele.x,
                ele.y
                
              )
            );
          } else {
            editorStore.info("Stelle ist bereits leer!");
          }
        }
        if (!editorStore.getters.getEntfernen) {
          // y-, x-Koordinaten und element ueber event identifizieren
          const y = parseInt(event.target.innerText.replace(/\s/g, "").split(",",3)[0].split(":",2)[1])
          const x = parseInt(event.target.innerText.replace(/\s/g, "").split(",",3)[1].split(":",2)[1])
          const e = parseInt(event.target.innerText.replace(/\s/g, "").split(",",3)[2].split(":",2)[1].split("}",1)[0])
          
          const ele = {y:y,x:x,e:e}
          // Wegpunkt setzen
          if (e === 0) {
            CommandStack.getInstance().execAndPush(
              new ElementHinzufuegenCommand(
                karte,
                editorStore.getters.getElement,
                editorStore.getters.getStackindex,
                event,
                ele
              )
            );
          } else {
            editorStore.info("Stelle ist bereits belegt!");
          }
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
  min-width: 800px;
  position: absolute;
  right: 0;
  left: 0.5px;
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

  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
}
</style>
