<!-- Regestrieren-Formular Komponente -->

<template>
  <h2 id="titel">Jetzt anmelden zu Rhein-Main Adventure!</h2>
  <section class="container">
    <div class="row content d-flex justify-content-center">
      <div class="col-md-12">
        <div class="box shadow bg-white p-4">
          <h3 class="mb-4 text-center">Registrieren!</h3>
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


            <div class="form-floating mb-3">
              <input id="confirmPasswort" class="form-control rounded-0"
                     input
                     placeholder="confirmPasswort"
                     required
                     type="password">
              <label for="floatingPasswort">Passwort wiederholen</label>
            </div>

            <div class="d-grid gap-2 mb-6">
              <div class="col md-6">
                <button class="btn btn-success btn-lg btn-block rounded-0" style="float: right;" type="submit">
                  Registrieren
                </button>

              </div>
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
import router from '@/router'

export default defineComponent({
  setup() {
    const form = reactive({
      benutzername: '',
      passwort: ''
    })
    const onSubmit = () => {
      userStore.signup(form.benutzername, form.passwort).then(() => {
        form.benutzername = ''
        form.passwort = ''
        router.push('/')
      }).catch((error) => {
        form.benutzername = ''
        form.passwort = ''
        console.log(error)
      })

    }
    return {form, userStore, onSubmit}
  }
})
</script>


<style scoped>
#titel {
  white-space: nowrap;
  text-align: center;
}

</style>