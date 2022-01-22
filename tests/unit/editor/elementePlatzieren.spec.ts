import { shallowMount } from '@vue/test-utils'
import Bausteine from "@/components/editor/Bausteine.vue"
import Editorfenster from "@/components/editor/Editorfenster.vue"
import Aktionstasten from "@/components/editor/Aktionstasten.vue"
import editorStore from "@/stores/editor"

describe('Editor.vue => Elemente platzieren', () => {

  test('Weg platzieren, redo und undo testen', async() => {
    const bausteineWrapper = shallowMount(Bausteine)
    const fensterWrapper = shallowMount(Editorfenster)
    const aktionstastenWrapper = shallowMount(Aktionstasten)

    const bausteine = await bausteineWrapper.findAll("button")
    const elemente = await fensterWrapper.findAll("div.element")
    const aktionen = await aktionstastenWrapper.findAll("button")

    const undo = aktionen[5]
    const redo = aktionen[6]

    // an Stelle 0,0 sollte initial eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    // 1 - Weg an Stelle 0,0 setzen
    bausteine[1].trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt eine 1 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(1)

    undo.trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)


    redo.trigger("click")
    // an Stelle 0,0 sollte jetzt eine 1 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(1)

    // wieder auf 0 fuer naechsten test
    undo.trigger("click")
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)
  })

  test('Start platzieren, redo und undo testen', async() => {
    const bausteineWrapper = shallowMount(Bausteine)
    const fensterWrapper = shallowMount(Editorfenster)
    const aktionstastenWrapper = shallowMount(Aktionstasten)

    const bausteine = await bausteineWrapper.findAll("button")
    const elemente = await fensterWrapper.findAll("div.element")
    const aktionen = await aktionstastenWrapper.findAll("button")

    const undo = aktionen[5]
    const redo = aktionen[6]

    // an Stelle 0,0 sollte initial eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    // 2 - Start an Stelle 0,0 setzen
    bausteine[2].trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt eine 2 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(2)

    undo.trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    redo.trigger("click")
    // an Stelle 0,0 sollte jetzt eine 2 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(2)

    // wieder auf 0 fuer naechsten test
    undo.trigger("click")
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)
  })

  test('Ziel platzieren, redo und undo testen', async() => {
    const bausteineWrapper = shallowMount(Bausteine)
    const fensterWrapper = shallowMount(Editorfenster)
    const aktionstastenWrapper = shallowMount(Aktionstasten)

    const bausteine = await bausteineWrapper.findAll("button")
    const elemente = await fensterWrapper.findAll("div.element")
    const aktionen = await aktionstastenWrapper.findAll("button")

    const undo = aktionen[5]
    const redo = aktionen[6]

    // an Stelle 0,0 sollte initial eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    // 3 - Ziel an Stelle 0,0 setzen
    bausteine[3].trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt eine 3 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(3)

    undo.trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    redo.trigger("click")
    // an Stelle 0,0 sollte jetzt eine 3 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(3)

    // wieder auf 0 fuer naechsten test
    undo.trigger("click")
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)
  })

  /*test('Schluessel platzieren, redo und undo testen', async() => {
    const bausteineWrapper = shallowMount(Bausteine)
    const fensterWrapper = shallowMount(Editorfenster)
    const aktionstastenWrapper = shallowMount(Aktionstasten)

    const bausteine = await bausteineWrapper.findAll("button")
    
    const elemente = await fensterWrapper.findAll("div.element")

    const aktionen = await aktionstastenWrapper.findAll("button")

    const undo = aktionen[5]
    const redo = aktionen[6]

    // an Stelle 0,0 sollte initial eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    // 1 - Weg an Stelle 0,0 setzen, da Schluessel nur auf Weg platziert werden kann
    bausteine[1].trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt eine 1 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(1)

    // 4 - Schluessel an Stelle 0,0 setzen
    bausteine[4].trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt eine 4 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(4)

    undo.trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 1 stehen = Weg
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(1)

    redo.trigger("click")
    // an Stelle 0,0 sollte jetzt eine 4 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(4)

    // wieder auf 0 fuer naechsten test
    undo.trigger("click")
  })*/

})