import {computed, reactive} from 'vue'
import {Karte} from '@/models/Karte';

/**
 * State des Editors
 * wegbeschreibung = Element (0: Wand, 1: Weg, 2: Start, 3: Ziel)
 * aktiv = wenn Baustein gewählt true
 * info = Text für das Infofenster
 * start = wenn Start platziert true
 * ziel = wenn Ziel platziert ture
 * raeume = Anzahhl platzierter Räume
 * ausrichtung = Raumausrichtung der aktuellen Platzierung
 * schluessel = anzahl der Schluessel
 * tuer = Anzahl der Tueren
 * npc = Anzahl der NPC's
 * entfernen = bool ob elemente entfernt werden
 * stackindex = CommandStack index
 */

const waehlen = "Bitte wählen (Weg, Start oder Ziel)"
const willkommen = "Willkommen beim Leveleditor.  Mit W, S und Z: Weg, Start oder Zielsetzung. Alle weiteren Elemente sind platzierbare Räume. Standardausrichtung der Tür ist horizontal."

const karte: Karte = new Karte(99999, "", "", "")

const state = reactive({
  wegbeschreibung: 0,
  aktiv: false,
  info: willkommen,
  start: false,
  ziel: false,
  raeume: 0,
  ausrichtung: 0,
  schluessel: 0,
  tuer: 0,
  npc: 0,
  entfernen: false,
  stackindex: 0,
})

/**
 * Getters für den State
 */
const getters = reactive({
  istAktiv: computed(() => {
    return state.aktiv;
  }),
  getElement: computed(() => {
    return state.wegbeschreibung;
  }),
  getInfo: computed(() => {
    return state.info;
  }),
  getStart: computed(() => {
    return state.start;
  }),
  getZiel: computed(() => {
    return state.ziel;
  }),
  getAusrichtung: computed(() => {
    return state.ausrichtung;
  }),
  getRaeume: computed(() => {
    return state.raeume
  }),
  getGrid: computed(() => {
    return karte
  }),
  getSchluessel: computed(() => {
    return state.schluessel
  }),
  getTuer: computed(() => {
    return state.tuer
  }),
  getNpc: computed(() => {
    return state.npc
  }),
  getEntfernen: computed(() => {
    return state.entfernen
  }),
  getStackindex: computed(() => {
    return state.stackindex
  }),
})

/**
 * Methoden zum verändern des States
 * setze = setzt je nach gewähltem Baustein aktiv auf true und wegbeschreibung mit gewünschtem Element
 * info = setzt Infotext
 * start = setzt start
 * ziel = setzt ziel
 * ausrichten = setzt ausrichtung des Elements
 * setze xy = setzt jeweiliges Element
 */
const actions = {
  async setze(wb: number) {
    switch (wb) {
      case 0: {
        state.wegbeschreibung = 0;
        state.aktiv = false;
        break;
      }
      case 1: {
        if (state.wegbeschreibung == wb) {
          if (state.aktiv) {
            state.wegbeschreibung = 0
            state.aktiv = false
            state.info = waehlen
          }
        } else {
          state.wegbeschreibung = wb
          state.aktiv = true
          state.info = "Bitte Weg einzeichnen."
        }
        break;
      }
      case 2: {
        if (state.wegbeschreibung == wb) {
          if (state.aktiv) {
            state.wegbeschreibung = 0
            state.aktiv = false
            state.info = waehlen
          }
        } else {
          state.wegbeschreibung = wb
          state.aktiv = true
          state.info = "Bitte Start einzeichnen."
        }
        break;
      }
      case 3: {
        if (state.wegbeschreibung == wb) {
          if (state.aktiv) {
            state.wegbeschreibung = 0
            state.aktiv = false
            state.info = waehlen
          }
        } else {
          state.wegbeschreibung = wb
          state.aktiv = true
          state.info = "Bitte Ziel einzeichnen."
        }
        break;
      }
      case 9: {
        state.aktiv = false
      }
    }
  },
  async info(info: string) {
    state.info = info
  },
  async wegbeschreibung(gesetzt: number) {
    state.wegbeschreibung = gesetzt
  },
  async start(gesetzt: boolean) {
    state.start = gesetzt
  },
  async ziel(gesetzt: boolean) {
    state.ziel = gesetzt
  },
  async ausrichten(richtung: number) {
    state.ausrichtung = richtung
  },
  async setzeRaum(gesetzt: number) {
    state.raeume += gesetzt
  },
  async setzeSchluessel(gesetzt: number) {
    state.schluessel += gesetzt
  },
  async setzeTuer(gesetzt: number) {
    state.tuer += gesetzt
  },
  async setzeNpc(gesetzt: number) {
    state.npc += gesetzt
  },
  async entfernen(gesetzt: boolean) {
    state.entfernen = gesetzt
  },
  async default() {
    state.wegbeschreibung = 0,
        state.aktiv = false,
        state.info = willkommen,
        state.start = false,
        state.ziel = false,
        state.raeume = 0,
        state.ausrichtung = 0,
        state.schluessel = 0,
        state.tuer = 0,
        state.npc = 0,
        state.stackindex = 0
  },
  async setzeLevel(erwartet: any) {
    const aktKarte = new Karte(erwartet.levelID, erwartet.benutzername, erwartet.levelName, erwartet.levelBeschreibung)
    karte.setLevelId(aktKarte._levelID)
    karte.setBenutzername(aktKarte._benutzername)
    karte.setLevelName(aktKarte._levelName)
    karte.setLevelBeschreibung(aktKarte._levelBeschreibung)
    karte.setBenutzername(aktKarte._benutzername)
    karte.setLevelInhalt(erwartet.levelInhalt)
  }
}

export default {state, getters, ...actions}
