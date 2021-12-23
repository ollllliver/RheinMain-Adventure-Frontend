<template>

    <!--
        Grid-Anzeige der Karte (drop-zone aus karte.liste[]) 
        klickbare divs für Wegeinzeichnung und Start/Ziel Platzierung + drag-and-drop der Bausteine
    --> 

    <div class="drop-zone" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
        <div v-for="row in liste" :key="row.value" class="reihe">
            <div v-for ="col in row" :key="col" v-bind="col.id" class="element" v-on:click="wegPunkt" draggable="false">
                
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, ref } from 'vue'
import { Karte } from './Karte'
import { CommandStack } from '../../commands/CommandManager'
import {ElementHinzufuegen} from '../../commands/Command'
import editorStore from '@/stores/editor'

export default defineComponent({
    name: "Editorfenster",
    setup() {
        // Kartenklasse mit liste als Array
        const karte = new Karte();
        const liste = karte.liste

        /**
         * bei drop (Drag-and-Drop) Raum auf der Karte platzieren
         * wenn Raum auf platzierte Stelle passt
         * über Command auf der Karte platzieren -> Platzierung in Command-Klasse
         */
        const onDrop = (event: any) => {
            const itemID = parseInt(event.dataTransfer.getData('itemID'));
            if (liste[event.target.__vnode.key.x][event.target.__vnode.key.y].e === 0) {
                // Wenn gültiger Bereich (Raum passt auf Karte)
                    if (event.target.__vnode.key.x - 1 >= 0 && event.target.__vnode.key.x + 1 < 14 && 
                        event.target.__vnode.key.y - 1 >= 0 && event.target.__vnode.key.y + 1 < 22) {    
                        CommandStack.getInstance().execAndPush(new ElementHinzufuegen(karte,itemID,event))
                        editorStore.setze(0);
                    } else {
                        editorStore.info("Raum passt nicht auf diese Position. Ein Raum besteht 2 x 3 Felder. Bitte wähle einen passenden Ort aus.")
                    }
            }
            else {
                editorStore.info("Stelle bereits belegt. Bitte vorher löschen oder an anderer Position belegen!")
            }
            console.log(liste)
        }   
        onUpdated(() => {
            //console.log(elemente.value)
        })
        onMounted(() => {
            //console.log(liste)
        })

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
                        editorStore.info("Start bereits gesetzt. Es gibt nur einen Startpunkt")
                        return;
                    }
                } 
                if (editorStore.getters.getElement === 3) {
                    if (editorStore.getters.getZiel) {
                        editorStore.info("Ziel bereits gesetzt. Es gibt nur ein Ziel")
                        return;
                    }
                }
                if (liste[event.target.__vnode.key.x][event.target.__vnode.key.y].e === 0) {
                    CommandStack.getInstance().execAndPush(new ElementHinzufuegen(karte,editorStore.getters.getElement,event))
                }
                else {
                    editorStore.info("Stelle bereits belegt. Bitte vorher löschen oder an anderer Position belegen!")
                }
            } else {
                editorStore.info("Bitte wähle erst ein Baustein aus!")
            }
        }
        return {
            onDrop, liste, wegPunkt
        }
    },
})
</script>

<style scoped>
    html, body {
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
        width:100%;
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