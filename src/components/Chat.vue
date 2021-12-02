<template>
    <div v-cloak>
        <h4>Chat:</h4>
        <div class=container>
            <div class="row">
            <div class="form-control">
                <input type="text" v-model="message" placeholder="Sag hallo...">
                <button type="submit" class="primary" v-on:click="senden(message)">Senden</button>
            </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import userStore from '@/stores/user'

export default defineComponent({
    
    props: {
        sendeNachricht:{
            required: true,
            type: Function
        }
    },
    setup(props){

        onMounted(userStore.getUser)

        function senden(nachricht:string){
            if(nachricht){
                props.sendeNachricht(nachricht, userStore.state.benutzername)
            }
        }

        return{
            senden, userStore
        }
    }
});
</script>

<style scoped>
</style>