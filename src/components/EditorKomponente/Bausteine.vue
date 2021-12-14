<template>
    <button class="btn btn-outline-secondary" v-for="item in items" :key="item.id" draggable="true" @dragstart="startDrag($event, item)">
    </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: "Bausteine",
    setup() {
        const items = ref(
            [
                {id:0, title:'0'},
                {id:1, title:'1'},
                {id:2, title:'2'},
                {id:3, title:'3'},
                {id:4, title:'4'},
                {id:5, title:'5'},
                {id:6, title:'6'},
                {id:7, title:'7'},
            ]
        )

        const startDrag = (event: any, item: any) => {
            console.log(item)
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'copy'
            event.dataTransfer.setData('itemID',item.id) 
        }

        

        return {
            items, startDrag
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