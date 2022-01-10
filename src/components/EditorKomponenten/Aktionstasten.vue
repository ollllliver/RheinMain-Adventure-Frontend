<template>

    <!--
        Aktionstasten
        Buttons zum Auslösen verschiedener Aktionen (speichern/löschen/redo/undo/...)
    -->

    <div>
        <button class="btn btn-outline-secondary " @click="zurPruefung()">
            zur Prüfung einreichen
        </button>
        <button class="btn btn-outline-secondary" @clicke="test()">
            später beenden
        </button>
        <button class="btn btn-outline-secondary" >
            abbrechen
        </button>
        <button class="btn btn-outline-secondary">
            alles entfernen
        </button>
        <button class="btn btn-outline-secondary" >
            löschen: An/Aus
        </button>
        <button class="btn btn-outline-secondary" @click="undo()">
            letzten Schritt rückgängig
        </button>
        <button class="btn btn-outline-secondary" @click="redo()">
            letzten Schritt wiederherstellen
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {CommandStack} from '../../commands/CommandManager'
import editorStore from "@/stores/editor";
//import {ConcreteCommandTest} from '../../commands/Command'

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
            if(editorStore.getters.getZiel === true) {
                if(editorStore.getters.getStart === true) {
                    /*if(editorStore.getters.getRaeume > 0) {
                        editorStore.info('Karte wird eingereicht. Raumanzahl: '+ editorStore.getters.getRaeume)
                        console.log(editorStore.getters.getGrid)
                    } else {
                        editorStore.info('Jede Karte benötigt mindestens 1 Raum. Bitte platziere erst einen Raum bevor du die Karte zur Prüfung einreichst.')
                    }*/
                    if(editorStore.getters.getSchluessel === editorStore.getters.getTuer) {
                        editorStore.info('Karte wird eingereicht. Schluessel='+ editorStore.getters.getSchluessel +' Tueren='+editorStore.getters.getTuer)
                        console.log(editorStore.getters.getGrid)
                        fetch("http://localhost:8080/api/levelEditor/speichern", {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({karte:editorStore.getters.getGrid.liste, name: editorStore.getters.getLevelName, minSpieler: editorStore.getters.getMinSpieler, maxSpieler: editorStore.getters.getMaxSpieler})}
                        ).then(function(res) {
                            console.log("LEVEL GESPEICHERT");
                            console.log(res);
                        });
                    } else {
                        editorStore.info('Fuer jede Tuer muss ein Schluessel existieren. Aktuelle Anzahl Tueren='+editorStore.getters.getTuer+ ' Schluessel='+editorStore.getters.getSchluessel)
                    }
                } else {
                    editorStore.info('Jede Karte benötigt einen Startpunkt. Bitte markiere einen Startpunkt.')
                }
            } else {
                editorStore.info('Jede Karte benötigt einen Zielpunkt. Bitte platziere einen Zielpunkt.')
            }
        }
        const test = () => {
            console.log("test",editorStore.getters.getLevelName, editorStore.getters.getMinSpieler, editorStore.getters.getMaxSpieler)
        }
        return {
            zurPruefung, test
        }
    }

})
</script>

<style scoped>
    button {
      width: 100%;
      font-size: 15px;
      font-weight: 400;
      color:black;
    }
</style>