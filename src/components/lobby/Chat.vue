<template>
    <form @submit.prevent="onSubmit">
    <div v-cloak>
        <h4>Chat:</h4>
        <div class=container>
            <div class="row">
            <div class="form-control">
                <ul id="messageArea"></ul>
                <button type="submit" style="float: right">Senden</button>
                <div style="overflow: hidden; padding-right: .5em;">
                    <input type="text" style="width: 100%;" v-model="form.message" placeholder="Sag hallo...">
                </div>
            </div>
            </div>
        </div>
    </div>
    </form>
</template>


<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
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

        const form = reactive({
            message: ''
        })

        const onSubmit = () => {
            senden(form.message)
            form.message = ''
        }

        function senden(nachricht:string){
            if(nachricht){
                props.sendeNachricht("CHAT", nachricht, userStore.state.benutzername)
            }
        }

        return{
            senden, userStore, message: "",
            onSubmit, form
        }
    }
});
</script>

<style scoped>
</style>