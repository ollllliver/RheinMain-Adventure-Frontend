// User Store für Aktionen mit dem Benutzer

import { computed, reactive } from 'vue'
import * as Request from '@/requests'
import router from '@/router';

const state = reactive({
  benutzername: '',
  istEingeloggt:false,
  error: ''
})

const getters = reactive({
  istEingeloggt: computed(() => {
    return state.istEingeloggt;
  }),
  getBenutzername: computed(() => {
    return state.benutzername
  })
})

// Aktionen die den User betreffen
const actions = {

  // liefert User zurück falls vorhanden
  async getUser() {
      await Request.getUser()
      if (state.benutzername === "") {
        state.istEingeloggt = false
      } else {
        state.istEingeloggt = true
      }
    },

  // versucht Login durchzuführen, falls erfolglos -> false
  async login(benutzername: string, passwort: string) {
    Request.login(benutzername, passwort).then((res) => {
      if (!res) {
        console.log("fehler");
        state.error = 'Anmelden fehlgeschlagen.';
        return false;
      }else{
        state.benutzername = benutzername;
        state.istEingeloggt = true;
        router.push("/");
      }
    }).catch ((err) => {
      console.log(err)
      return true
    })
  },

  // registriert Benutzer, falls erfolglos -> false
  async signup(benutzername: string, passwort: string) {
    const user = await Request.signup(benutzername, passwort)
    if (user == null) {
      state.error = 'username already exist'
      return false
    }
    return true
  },

  // loggt den Nutzer aus
  async logout() {
    await Request.logout(state.benutzername)
    state.benutzername = ''
    state.istEingeloggt = false
  }
}

export default { state, getters, ...actions }
