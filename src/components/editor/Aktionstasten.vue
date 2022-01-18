<template>
  <!-- Aktionstasten: Buttons zum Auslösen verschiedener Aktionen (speichern/löschen/redo/undo/...) -->
  <div>
    <button class="btn btn-outline-secondary" @click="zurPruefung()" name="pruef">zur Prüfung einreichen</button>
    <button class="btn btn-outline-secondary" @click="test()">später beenden</button>
    <button class="btn btn-outline-secondary">abbrechen</button>
    <button class="btn btn-outline-secondary" v-on:click="allesEntfernen">alles entfernen</button>
    <button class="btn btn-outline-secondary" @click="entfernen()">löschen: An/Aus</button>
    <button class="btn btn-outline-secondary" @click="undo()">letzten Schritt rückgängig</button>
    <button class="btn btn-outline-secondary" @click="redo()">letzten Schritt wiederherstellen</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CommandStack } from "../../commands/CommandManager";
import editorStore from "@/stores/editor";

export default defineComponent({
  name: "Aktionstasten",
  methods: {
    undo() {
      // letzten Befehl vom Stack rückgängig machen
      CommandStack.getInstance().undo();
    },
    redo() {
      // letzten Befehl vom Stack wiederherstellen
      CommandStack.getInstance().redo();
    },
  },

  setup() {
    
    
    // Karte nach Prüfung ob Start/Ziel und Raum platziert wurde loggen (vorerst)
    const zurPruefung = () => {
      if (editorStore.getters.getZiel === true) {
        if (editorStore.getters.getStart === true) {
          /*
          if(editorStore.getters.getRaeume > 0) {
            editorStore.info('Karte wird eingereicht. Raumanzahl: '+ editorStore.getters.getRaeume)
            console.log(editorStore.getters.getGrid)
          } else {
            editorStore.info('Jede Karte benötigt mindestens 1 Raum. Bitte platziere erst einen Raum bevor du die Karte zur Prüfung einreichst.')
          }
          */
          if (editorStore.getters.getSchluessel === editorStore.getters.getTuer) {
            editorStore.info("Karte wird eingereicht. Schluessel=" + editorStore.getters.getSchluessel + " Tueren=" + editorStore.getters.getTuer);
            console.log(editorStore.getters.getGrid);
            let n = Math.floor(Math.random() * 120);
            fetch("http://localhost:8080/api/level", {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                karte: editorStore.getters.getGrid.liste,
                name: n.toString(),
              }),
            }).then(function (res) {
              console.log("LEVEL GESPEICHERT");
              console.log(res);
            });
          } else {
            editorStore.info("Fuer jede Tuer muss ein Schluessel existieren. Aktuelle Anzahl Tueren=" + editorStore.getters.getTuer + " Schluessel=" + editorStore.getters.getSchluessel);
          }
        } else {
          editorStore.info("Jede Karte benötigt einen Startpunkt. Bitte markiere einen Startpunkt.");
        }
      } else {
        editorStore.info("Jede Karte benötigt einen Zielpunkt. Bitte platziere einen Zielpunkt.");
      }
    };

    const allesEntfernen = (event: any) => {

      const stack = CommandStack.getInstance().getStack().length
      for(let i = 0; i < stack; i++) {
        CommandStack.getInstance().undo()
        CommandStack.getInstance().getStack().pop()
      }
      editorStore.default()
      //console.log(editorStore.getters.getGrid)
      /*console.log(CommandStack.getInstance().getStack()[1])
      for (let i = 0; i < editorStore.getters.getStackindex; i++) {
        
        for (let j = 0; j < 22; j++) {
          let storeElement = liste[i][j].e;
          if (storeElement !== 0) {
            console.log("Stack Element: { " + i + " " + j + " } " + storeElement);
            
            
          }
        }
      }*/
    }

    const entfernen = () => {
      if (editorStore.getters.getEntfernen === false) {
        editorStore.info("Elemente werden jetzt entfernt");
        editorStore.entfernen(true);
        editorStore.wegbeschreibung(0);
        if (!editorStore.state.aktiv) {
          editorStore.state.aktiv = true;
        }
      } else {
        editorStore.info("");
        editorStore.entfernen(false);
        if (editorStore.state.aktiv) {
          editorStore.state.aktiv = false;
        }
      }
    };

    const test  = () => {
      console.log(editorStore.getters.getGrid)
    }

    return {
      zurPruefung,
      allesEntfernen,
      test,
      entfernen
    };
  },
});
</script>

<style scoped>
button {
  width: 100%;
  font-size: 15px;
  font-weight: 400;
  color: black;
}
</style>
