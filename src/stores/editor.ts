import { computed, reactive } from 'vue'

/**
 * State des Editors
 * wegbeschreibung = Element (0: Wand, 1: Weg, 2: Start, 3: Ziel)
 * aktiv = wenn Baustein gewählt true
 * info = Text für das Infofenster
 * start = wenn Start platziert true
 * ziel = wenn Ziel platziert ture
 */
const state = reactive({
    wegbeschreibung: 0,
    aktiv: false,
    info: '',
    start: false,
    ziel: false
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
                        state.info = ""
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
                        state.info = ""
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
                        state.info = ""
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
    }

}

export default { state, getters, ...actions }