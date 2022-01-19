<!-- Regestrieren-Formular Komponente -->

<template>
  <form @submit.prevent="onSubmit">
    <div class="form-group my-2">
      <label>Benutzername</label>
      <input
        v-model="form.benutzername"
        class="form-control"
        placeholder="Benutzername"
        required
      />
    </div>
    <div class="form-group my-2">
      <label>Passwort</label>
      <input
        v-model="form.passwort"
        class="form-control"
        type="passwort"
        placeholder="Passwort"
        required
      />
    </div>
    <div class="text-danger my-2">{{ userStore.state.error }}</div>
    <button class="btn btn-success btn-block my-2" type="submit">Sign Up</button>
  </form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import userStore from '@/stores/user'
import router from '@/router'
export default defineComponent({
  setup() {
    const form = reactive({
      benutzername: '',
      passwort: ''
    })
    const onSubmit = () => {
      userStore.signup(form.benutzername, form.passwort).then((response)=>{
        form.benutzername = ''
        form.passwort = ''
        router.push('/')
      }).catch((error)=>{
        console.log(error)
      })
      
    }
    return { form, userStore, onSubmit }
  }
})
</script>