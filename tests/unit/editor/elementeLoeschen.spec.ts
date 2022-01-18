import { shallowMount } from '@vue/test-utils'
import Bausteine from "@/components/editor/Bausteine.vue"
import Editorfenster from "@/components/editor/Editorfenster.vue"
import Aktionstasten from "@/components/editor/Aktionstasten.vue"
import editorStore from "@/stores/editor"

describe('Editor.vue => Elemente loeschen', () => {

  test('Weg loeschen, redo und undo testen', async() => {
    const bausteineWrapper = shallowMount(Bausteine)
    const fensterWrapper = shallowMount(Editorfenster)
    const aktionstastenWrapper = shallowMount(Aktionstasten)

    const bausteine = await bausteineWrapper.findAll("button")
    const elemente = await fensterWrapper.findAll("div.element")
    const aktionen = await aktionstastenWrapper.findAll("button")
    
    const loeschen = aktionen[4]
    const undo = aktionen[5]
    const redo = aktionen[6]

    // an Stelle 0,0 sollte initial eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    // 1 - Weg an Stelle 0,0 setzen
    bausteine[1].trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt eine 1 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(1)

    loeschen.trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    undo.trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 1 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(1)
    
    redo.trigger("click")
    // an Stelle 0,0 sollte jetzt eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)
  })

  test('Start loeschen, redo und undo testen', async() => {
    const bausteineWrapper = shallowMount(Bausteine)
    const fensterWrapper = shallowMount(Editorfenster)
    const aktionstastenWrapper = shallowMount(Aktionstasten)

    const bausteine = await bausteineWrapper.findAll("button")
    const elemente = await fensterWrapper.findAll("div.element")
    const aktionen = await aktionstastenWrapper.findAll("button")
    
    const loeschen = aktionen[4]
    const undo = aktionen[5]
    const redo = aktionen[6]

    // an Stelle 0,0 sollte initial eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    // 2 - Start an Stelle 0,0 setzen
    bausteine[2].trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt eine 1 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(2)

    loeschen.trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    undo.trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 2 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(2)
    
    redo.trigger("click")
    // an Stelle 0,0 sollte jetzt eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)
  })

  test('Ziel loeschen, redo und undo testen', async() => {
    const bausteineWrapper = shallowMount(Bausteine)
    const fensterWrapper = shallowMount(Editorfenster)
    const aktionstastenWrapper = shallowMount(Aktionstasten)

    const bausteine = await bausteineWrapper.findAll("button")
    const elemente = await fensterWrapper.findAll("div.element")
    const aktionen = await aktionstastenWrapper.findAll("button")
    
    const loeschen = aktionen[4]
    const undo = aktionen[5]
    const redo = aktionen[6]

    // an Stelle 0,0 sollte initial eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    // 3 - Ziel an Stelle 0,0 setzen
    bausteine[3].trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt eine 3 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(3)

    loeschen.trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    undo.trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 3 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(3)
    redo.trigger("click")

    // an Stelle 0,0 sollte jetzt eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)
  })

  test('alles loeschen testen', async() => {
    const bausteineWrapper = shallowMount(Bausteine)
    const fensterWrapper = shallowMount(Editorfenster)
    const aktionstastenWrapper = shallowMount(Aktionstasten)

    const bausteine = await bausteineWrapper.findAll("button")
    const elemente = await fensterWrapper.findAll("div.element")
    const aktionen = await aktionstastenWrapper.findAll("button")
    
    const allesLoeschen = aktionen[3]

    // an Stelle 0,0 sollte initial eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    // 1 - Weg an Stelle 0,0 setzen
    bausteine[1].trigger("click")
    elemente[0].trigger("click")
    // an Stelle 0,0 sollte jetzt eine 1 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(1)

    // 2 - Start an Stelle 0,1 setzen
    bausteine[2].trigger("click")
    elemente[1].trigger("click")
    // an Stelle 0,1 sollte jetzt eine 2 stehen
    expect(editorStore.getters.getGrid.liste[0][1].e).toBe(2)

    // 3 - Ziel an Stelle 0,2 setzen
    bausteine[3].trigger("click")
    elemente[2].trigger("click")
    // an Stelle 0,2 sollte jetzt eine 3 stehen
    expect(editorStore.getters.getGrid.liste[0][2].e).toBe(3)

    allesLoeschen.trigger("click")
    // an Stelle 0,0 sollte jetzt wieder eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][0].e).toBe(0)

    // an Stelle 0,1 sollte jetzt wieder eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][1].e).toBe(0)

    // an Stelle 0,2 sollte jetzt wieder eine 0 stehen
    expect(editorStore.getters.getGrid.liste[0][2].e).toBe(0)

  })

})