<template>

    <!--
        Eigenschaften fuer das Level
    -->
    <div>
        <input v-model="levelName" placeholder ="Levelname" @change="setzeLevelName">
        <input v-model="minSpieler" placeholder="min. Spieleranzahl" @change="setzeMinSpieler">
        <input v-model="maxSpieler" placeholder="max. Spieleranzahl" @change="setzeMaxSpieler">
        
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import editorStore from '@/stores/editor'
export default defineComponent({
    name:"Leveleigenschaften",
    methods: {
        setzeLevelName: (name: any) => {
            editorStore.setzeLevelName(name.target.value);
        },
        setzeMinSpieler: (min: any) => {
            editorStore.setzeMinSpieler(min.target.value);
        },
        setzeMaxSpieler: (max: any) => {
            editorStore.setzeMaxSpieler(max.target.value);
        }
    },
    setup() {
        let minSpieler;
        let maxSpieler;
        let levelName = ""
        
        return {
            minSpieler, maxSpieler, levelName
        }
    },
})
</script>
<style scoped>
    input {
        margin-left: -20px;
        width:150px;
        height:20px;
    }
</style>
