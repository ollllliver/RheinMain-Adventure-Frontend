<!-- Login-Formular Komponente -->

<template>
  <section class="d-flex justify-content-center">
    <div class="row content d-flex justify-content-center m-5 w-25">
      <div class="col-md-12">
        <div class="box shadow bg-white p-4">
          <h3 class="mb-4 text-center fs-1">Einloggen</h3>
          <form class="mb-3" @submit.prevent="onSubmit">
            <div class="form-floating mb-3">
              <input id="floatingInput"
                     v-model="form.benutzername"
                     class="form-control rounded-0"
                     placeholder="Benutzername"
                     required>
              <label for="floatingInput">Benutzername</label>
            </div>
            <div class="form-floating mb-3">
              <input id="floatingPasswort" v-model="form.passwort" class="form-control rounded-0"
                     input
                     placeholder="Passwort"
                     required
                     type="password">
              <label for="floatingPasswort">Passwort</label>
            </div>

            <div class="d-grid gap-2 mb-6">{{ userStore.state.error }}
              <div class="col md-6">
                <button class="btn btn-success btn-lg btn-block rounded-0" style="float: right;" type="submit">
                  Einloggen
                </button>
              </div>
              <p align="left" class="text">Noch keinen Account?
                <button id="anmelden" class="btn btn-outline-warning" @click="$router.push('SignUp')">Jetzt anmelden
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>


</template>
<script lang="ts">
import {defineComponent, reactive} from 'vue'
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

      }).catch(error => {
        form.benutzername = ''
        form.passwort = ''
      })

    }

    return {form, userStore, onSubmit}
  }
})
</script>

<style scoped>
button {
  margin-left: 10px;
}

#anmelden {
  border: 2px white;
}
</style>