<template>
    <div v-cloak>
        <h4 class="center">Lade deine Freunde ein!</h4>
        <div class=container>
            <div class="row">
            <div class="form-control">
                <span class="title">{{linkCopy}}</span>
                <button class="btn btn-info text-white" v-on:click="copyInviteLink">Link kopieren</button>
                <input type="hidden" id="link-copy" :value="linkCopy">
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({

    data: () => {
        return {
        //TODO Link für Lobby
        linkCopy: "https://dummy-link.copy"
        }
    },

    methods: {
        //Kopiert den Text aus linkCopy 
        copyInviteLink(){
            try {
                navigator.clipboard.writeText(this.linkCopy)
            } catch (err) {
                console.error("Link konnte nicht kopiert werden")
            }
        }
    }
});

</script>

<style scoped>

</style>