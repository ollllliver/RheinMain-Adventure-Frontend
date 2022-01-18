// User Store für Aktionen mit dem Benutzer

import { computed, reactive } from 'vue'
import * as Request from '@/requests'

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
      const user = await Request.getUser()
      if (state.benutzername === "") {
        state.istEingeloggt = false
      } else {
        state.istEingeloggt = true
      }
    },

  // versucht Login durchzuführen, falls erfolglos -> false
  async login(benutzername: string, passwort: string) {
    try {
      const user = await Request.login(benutzername, passwort)
      if (user == null) {
        console.log("fehler")
        state.error = 'Could not find user.'
        return false
      }
      state.benutzername = benutzername
      state.istEingeloggt = true
    } catch (err) {
      console.log(err)
    }
    return true
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