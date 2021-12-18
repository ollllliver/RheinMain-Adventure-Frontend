<template>

    <!--
        Aktionstasten
        Buttons zum Auslösen verschiedener Aktionen (speichern/löschen/redo/undo/...)
    -->

    <div>
        <button class="btn btn-outline-secondary">
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
//import {ConcreteCommandTest} from '../../commands/Command'

export default defineComponent({
    name: "Aktionstasten",
    methods: {
        doSomething() {
            // CommandStack.getInstance().execAndPush(new ConcreteCommandTest(this.wand))
            // console.log(CommandStack.getInstance().toString())
        },
        undo() {
            CommandStack.getInstance().undo();
            // console.log(CommandStack.getInstance().toString())
        },
        redo() {
            CommandStack.getInstance().redo();
            // console.log(CommandStack.getInstance().toString())
        }
    },
    setup() {
        return {
        }
    }

})
</script>

<style scoped>
    button{
      width: 100%;
    }
</style>