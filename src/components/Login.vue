<!-- Login-Formular Komponente -->

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
    <button class="btn btn-success btn-block my-2" type="submit">Login</button>
    <button class="btn btn-secondary" @click="$router.push('SignUp')">Sign Up</button>
  </form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { SpielerLokal } from '@/models/SpielerLokal';
import userStore from '@/stores/user'
import router from "@/router"
export default defineComponent({
  setup() {
    const form = reactive({
      benutzername: '',
      passwort: ''
    })
    const onSubmit = () => {
      userStore.login(form.benutzername, form.passwort).then(response => {
        router.push('/')
        //console.log("Benutzer "+ form.benutzername + " erfolgreich eingeloggt.");
        
      }).catch(error => {
        //console.log(error.response)
        //console.log("Benutzer "+ form.benutzername + " konnte nicht eingeloggt werden.");
        form.benutzername = ''
        form.passwort = ''
      })
      
    }

    return { form, userStore, onSubmit }
  }
})
</script>

<style scoped>
button {
  margin-left: 10px;
}
</style>