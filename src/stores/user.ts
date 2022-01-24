// User Store für Aktionen mit dem Benutzer

import { computed, reactive } from 'vue'
import * as Request from '@/services/user/requests'

const state = reactive({
  benutzername: '',
  istEingeloggt: false,
  error: ''
})

/**
 * Liefert true/false ob ein Benutzer bereits eingeloggt ist
 */
const getters = reactive({
  istEingeloggt: computed(() => {
    return state.istEingeloggt;
  }),
  getBenutzername: computed(() => {
    return state.benutzername
  })
})

// Aktionen die den Benutzer betreffen
const actions = {

  /**
   * Setzt state.istEingeloggt fuer Routing auf true/false je nachdem ob ein Benutzer eingeloggt ist oder nicht
   */
  async getUser() {
    Request.getUser().then(()=>{
      if (!state.benutzername) {
        state.istEingeloggt = false
      } else {
        state.istEingeloggt = true
      }
    })
  },
  /**
   * Loggt Benutzer ein, bekommt JWTToken aus Backend und speichert diesen im Header jeder
   * Anfrage ans Backend mit Axios.get/post... 
   * @param benutzername 
   * @param passwort 
   * @returns Liefert Promise.resolve/reject
   */
  async login(benutzername: string, passwort: string) {

    const response = await Request.login(benutzername, passwort);

    if (response.status >= 200 && response.status <= 300) {
      console.log("Benutzer " + benutzername + " eingeloggt.");

      // token im session storage oder so speichern
      state.istEingeloggt = true;
      state.benutzername = benutzername;
      // Add a request interceptor (sends bearer token with every axios request)

      // Mit dem Aktuellen Backend gibts keine Token in den responedata, desshalb auskommentiert.
      // axios.defaults.headers.common['Authorization'] = "Bearer " + response.data;
      // sessionStorage.setItem("jwttoken", response.data)
      return Promise.resolve(response)
    } else {
      console.log("LOGIN FEHLGESCHLAGEN");
      return Promise.reject("LOGIN FEHLGESCHLAGEN");
    }
  },

  /**
   * Registriert Benutzer in Backend Datenbank
   * @param benutzername 
   * @param passwort 
   * @returns Http.status OK mit Benutzerobjekt bei Erfolg, Http.status NO_CONTENT bei scheitern
   */
  async signup(benutzername: string, passwort: string) {
    const response = await Request.signup(benutzername, passwort);

    if (response.status >= 200 && response.status <= 300) {
      console.log("Benutzer " + benutzername + " registriert.");
      return Promise.resolve(response)
    } else {
      console.log("REGISTRIEREN FEHLGESCHLAGEN");
      return Promise.reject("REGISTRIEREN FEHLGESCHLAGEN");
    }
  },

  /**
   * Loggt den Nutzer aus und loescht Authorization Header (JWTtoken bearer)
   */
  async logout() {
    await Request.logout(state.benutzername)
    state.benutzername = ''
    state.istEingeloggt = false

    // Mit dem Aktuellen Backend gibts keine Token siehe in login, desshalb auskommentiert.
    // sessionStorage.setItem("jwttoken","")
    // Remove Axios interceptor 
    // delete axios.defaults.headers.common['Authorization'];
    //router.push('/')
  }
}

export default { state, getters, ...actions }
