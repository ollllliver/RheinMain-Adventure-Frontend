// User Store für Aktionen mit dem Benutzer

import { computed, reactive } from 'vue'
import * as Request from '@/requests'

const state = reactive({
  username: '',

  error: ''
})

const getters = reactive({
  isLoggedIn: computed(() => state.username !== '')
})

// Aktionen die den User betreffen
const actions = {

  // liefert User zurück falls vorhanden
  async getUser() {
    const user = await Request.getUser()
    if (user == null) return

    state.username = user.username
  },

  // versucht Login durchzuführen, falls erfolglos -> false
  async login(username: string, password: string) {
    const user = await Request.login(username, password)
    if (user == null) {
      state.error = 'Could not find user.'
      return false
    }

    state.username = username
    state.error = ''

    return true
  },

  // registriert Benutzer, falls erfolglos -> false
  async signup(username:string, password:string) {
    const user = await Request.signup(username,password)
    if (user == null) {
      state.error ='username already exist'
      return false
    }
    
    return true
  },
  // loggt den Nutzer aus
  async logout() {
    state.username = ''
  }
}

export default { state, getters, ...actions }