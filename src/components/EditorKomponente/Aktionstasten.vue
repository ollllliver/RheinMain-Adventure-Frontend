<template>
    <div>
        <button class="btn btn-outline-secondary" >
            zur Prüfung einreichen
        </button>
        <button class="btn btn-outline-secondary" >
            später beenden
        </button>
        <button class="btn btn-outline-secondary" >
            abbrechen
        </button>
        <button class="btn btn-outline-secondary" >
            alles entfernen
        </button>
        <button class="btn btn-outline-secondary" >
            löschen: An/Aus
        </button>
        <button class="btn btn-outline-secondary" >
            letzten Schritt rückgängig
        </button>
        <button class="btn btn-outline-secondary" >
            letzten Schritt wiederherstellen
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: "Aktionstasten"
})
</script>

<style scoped>
    button{
      width: 100%;
    }
</style>