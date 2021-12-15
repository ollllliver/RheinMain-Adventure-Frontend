<template>
    <div class="drop-zone" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
        <div v-for="row in liste" :key="row.value" class="reihe">
            <div v-for ="col in row" :key="col" v-bind="col.id" class="element" v-on:click="wegPunkt">
                
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, ref } from 'vue'
import {Karte} from './Karte'

export default defineComponent({
    name: "Editorfenster",
        
    setup() {
        let elemente : any = ref([])
        const karte = new Karte();
        const liste = karte.liste
        
        
        const onDrop = (event: any) => {
            const itemID = event.dataTransfer.getData('itemID')
            console.log(itemID)
            elemente.value.push(itemID)
        }   
        onUpdated(() => {
            console.log(elemente.value)
        })
        onMounted(() => {
            console.log(liste)
        })

        const wegPunkt = (event: any) => {
            console.log('weg', event.target.__vnode.key.x, event.target.__vnode.key.y)
            event.target.style = "background-color: rgba(155, 70, 14, 1);"
            karte.setElement(event.target.__vnode.key.x, event.target.__vnode.key.y, 1)
            console.log(liste)
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
        border: 1px solid black;
        background-color: rgba(92, 92, 92, 0.397);
    }

</style>