import { computed, reactive } from 'vue'
import { Karte } from '@/components/EditorKomponenten/Karte';

/**
 * State des Editors
 * wegbeschreibung = Element (0: Wand, 1: Weg, 2: Start, 3: Ziel)
 * aktiv = wenn Baustein gewählt true
 * info = Text für das Infofenster
 * start = wenn Start platziert true
 * ziel = wenn Ziel platziert ture
 * raeume = Anzahhl platzierter Räume
 * ausrichtung = Raumausrichtung der aktuellen Platzierung
 */
const waehlen = "Bitte wählen. (W, S, Z oder R1-R5)"
const willkommen = "Willkommen beim Leveleditor.  Mit W, S und Z: Weg, Start oder Zielsetzung. R1-R5 sind platzierbare Räume. Standardausrichtung ist horizontal."
const karte = new Karte();
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
    npc: 0
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
    getRaeume: computed(()=> {
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
    })
})

/**
 * Methoden zum verändern des States
 * setze = setzt je nach gewähltem Baustein aktiv auf true und wegbeschreibung mit gewünschtem Element
 * info = setzt Infotext
 * start = setzt start
 * ziel = setzt ziel
 */
const actions = {
    async setze(wb: number) {
        switch(wb) {
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
    }

}

export default { state, getters, ...actions }