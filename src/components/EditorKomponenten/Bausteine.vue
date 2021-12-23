<template>
    
    <!--
        Bausteine
        Weg-/Start-/Zielbutton + draggable Raum-Bausteine
    -->

    <button class="btn btn-outline-secondary" :class="weg" @click="waehle($event, weg)" > W </button>
    <button class="btn btn-outline-secondary" :class="start" @click="waehle($event, start)"> S </button>
    <button class="btn btn-outline-secondary" :class="ziel" @click="waehle($event,ziel)"> Z </button>
    <button class="btn btn-outline-secondary" v-for="raum in raeume" :key="raum.id" draggable="true" 
    @dragstart="startDrag($event, raum)" @click="setzeInfo(raum)"> R{{raum.title}} </button>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import editorStore from '../../stores/editor'

export default defineComponent({
    name: "Bausteine",
    setup() {
        
        // Wegbeschreibung Weg/Start/Ziel
        const weg = 1
        const start = 2
        const ziel = 3

        // Räume
        const raeume = ref(
            [
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
            ]
        )

        // bei drag (Drag-and-Drop) Baustein kopieren und platzierbar machen
        const startDrag = (event: any, item: any) => {
            console.log(item)
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'copy'
            event.dataTransfer.setData('itemID',item.id)
            editorStore.setze(9) 
        }

        // element waehlen das platziert werden soll (W = 0, S = 1, Z = 2)
        const waehle = (event: any, item: any) => {
            editorStore.setze(item)
        }

        const setzeInfo = (item: any) => {
            editorStore.info(item.rauminfo)
        }

        return {
                raeume, startDrag, waehle, setzeInfo, weg, start, ziel
        }
    },
    
})
</script>
<style scoped>
    button {
        margin: 10px;
        width: 40px;
        height: 30px;
    }
</style>