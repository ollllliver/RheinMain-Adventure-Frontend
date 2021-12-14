<template>
    <div class="drop-zone" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
        <div v-for="item in elemente" :key="item.id" draggable="false">
            {{item.id}}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onUpdated, ref } from 'vue'

export default defineComponent({
    name: "Editorfenster",

    setup() {
        let elemente : any = ref([]) 

        const onDrop = (event: any) => {
            const itemID = event.dataTransfer.getData('itemID')
            console.log(itemID)
            elemente.value.push(itemID)
        }   
        onUpdated(() => {
            console.log(elemente.value)
        })
        return {
            elemente, onDrop
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
    }
</style>