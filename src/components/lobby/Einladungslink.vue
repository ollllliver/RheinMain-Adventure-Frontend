<template>
    <div v-cloak>
        <h4 class="center">Lade deine Freunde ein!</h4>
        <div class="row">
            <div class="form-control">
                <span class="title">{{link}}</span>
                <button class="btn btn-success text-white" v-on:click="copyInviteLink">Link kopieren</button>
                <input type="hidden" id="link-copy" :value="link">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    props: {
        link: {
            required: true,
            type: String as PropType<string>,
        }
    },    

    methods: {
        //Kopiert den Text aus link 
        copyInviteLink(){
            try {
                navigator.clipboard.writeText(this.link)
            } catch (err) {
                console.error("Link konnte nicht kopiert werden")
            }
        }
    }
});

</script>

<style scoped>

</style>