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
import { Karte } from './EditorKomponenten/Karte'
import { CommandStack } from '../commands/CommandManager'
import {ElementHinzufuegen} from '../commands/Command'
import editorStore from '@/stores/editor'

export default defineComponent({
    name: "Editorfenster",
    setup() {
        // test
        let elemente : any = ref([])
        // Kartenklasse mit liste als Array
        const karte = new Karte();
        const liste = karte.liste

        /**
         * bei drop (Drag-and-Drop) Baustein auf der Karte platzieren
         * noch nicht fertig implementiert, nur zum testen
         */

        const onDrop = (event: any) => {
            console.log(event.target.__vnode.key)
            const itemID = event.dataTransfer.getData('itemID')
            console.log(itemID)
            console.log(event)
            karte.setElement(event.target.__vnode.key.x, event.target.__vnode.key.y, itemID)
            karte.setElement(event.target.__vnode.key.x, event.target.__vnode.key.y-1, itemID)
            karte.setElement(event.target.__vnode.key.x, event.target.__vnode.key.y+1, itemID)
            karte.setElement(event.target.__vnode.key.x-1, event.target.__vnode.key.y, itemID)
            karte.setElement(event.target.__vnode.key.x+1, event.target.__vnode.key.y, itemID)
            karte.setElement(event.target.__vnode.key.x+1, event.target.__vnode.key.y+1, itemID)
            karte.setElement(event.target.__vnode.key.x-1, event.target.__vnode.key.y-1, itemID)
            event.target.style = "background-color: rgba(155, 70, 14, 1);"
            elemente.value.push(itemID)
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
         * über Command auf der Karte platzieren -> Platzierung in Command-Klasse
         */
         
        const wegPunkt = (event: any) => {
            
            if (editorStore.getters.istAktiv) {
                CommandStack.getInstance().execAndPush(new ElementHinzufuegen(karte,editorStore.getters.getElement,event))
            } else {
                editorStore.info("Bitte wähle erst ein Baustein aus!")
            }
        }
        return {
            elemente, onDrop, liste, wegPunkt
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