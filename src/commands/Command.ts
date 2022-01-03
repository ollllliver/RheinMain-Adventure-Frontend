import { ICommand } from "./CommandManager";
import { CommandStack } from './CommandManager'
import {Karte} from '../components/EditorKomponenten/Karte'
import editorStore from '@/stores/editor'

/*
 * Jeder Befehl bekommt seine eigene Klasse und implementiert das ICommand Interface
 */

/**
 * Nur zu Testzwecken und als Beispiel
 */

/* eslint-disable */
export class ConcreteCommandTest implements ICommand{
    private _state: {x:number };

    constructor(state: {x:number }){
        this._state = state;
    }

    execute = () => {
        this._state.x += 1;
        return "state + 1"
    }

    redo = () => {
        return "redo"
    }

    undo = () => {
        this._state.x -= 1;
        return "state -= 1"
    }

    describe = () => {
        return "Plus-1-Befehl"
    }

}

/**
 * Nur zu Testzwecken und als Beispiel
 */
export class ConcreteMultiply implements ICommand{
    private _state: {x:number };
    private _produkt: number  ;

    constructor(state: {x:number},produkt: number){
        this._state = state;
        this._produkt = produkt;
    }

    execute = () => {
        this._state.x *= this._produkt;
    }

    redo = () => {
        return "redo"
    }

    undo = () => {
        this._state.x /= this._produkt;
    }

    describe = () => {
        return "Multipliziere-" +this._produkt+ "-Befehl";
    }
}

/**
 * Command zum einfügen des gewählten Elements
 */
export class ElementHinzufuegen implements ICommand {
    
    private _state: number;
    private _karte: any
    private _element: {posX: number, posY: number, e: number}
    private _event: any
    public _ausrichtung: number

    /**
     * @param karte  Karte auf der bearbeitet wird
     * @param element element das hinzugefügt wird (1 = Weg, 2 = Start, 3 = Ziel)
     * @param event event auf dem das Einfügen stattfindet (kann man bestimmt besser lösen)
     */

    constructor(karte: Karte , element: number, event: any) {
        this._state = 0;
        this._karte = karte;
        this._event = event
        this._element = {posY: this._event.target.__vnode.key.y, posX: this._event.target.__vnode.key.x, e: element}
        this._ausrichtung = 0
    }

    /**
     * Befehl ausführen
     */
    execute = () => {
        // Braucht man für CommandManager ?
        this._state += 1;
        if(editorStore.getters.getAusrichtung !== this._ausrichtung) {this._ausrichtung = editorStore.getters.getAusrichtung}
        if (this._karte.liste[this._element.posY][this._element.posX].e !== this._element.e) {
            switch (this._element.e) {
                // Wenn Element Wegpunkt ist
                case 1: {
                    // Elemente in Karte einfügen falls noch kein Element an dieser Stelle ist
                    this._karte.setElement(this._element.posY, this._element.posX, this._element.e);  
                    // Hintergrund des Divs auf Farbe des Elements ändern
                    this._event.target.style = "background-color: rgba(255,211,155, 0.75);"  
                    editorStore.info("Wegpunkt platziert.")
                    break;
                }
                // Wenn Element Start ist
                case 2: {
                    // Elemente in Karte einfügen falls noch kein Element an dieser Stelle ist
                    this._karte.setElement(this._element.posY, this._element.posX, this._element.e);  
                    // Hintergrund des Divs auf Farbe des Elements ändern
                    this._event.target.style = "background-color:rgba(37, 187, 31, 0.658);"
                    editorStore.info("Start platziert.")
                    editorStore.start(true)
                    break;
                }
                // wenn Element Ziel ist
                case 3: {
                    // Elemente in Karte einfügen falls noch kein Element an dieser Stelle ist
                    this._karte.setElement(this._element.posY, this._element.posX, this._element.e);  
                    // Hintergrund des Divs auf Farbe des Elements ändern
                    this._event.target.style = "background-color:rgba(19, 30, 196, 0.658);"
                    editorStore.info("Ziel platziert.")
                    editorStore.ziel(true)
                    break;
                }
                // Wenn Element ein Raum ist
                case 4:
                case 5:
                case 6:
                case 7:
                case 8: {
                    // Wenn horizontale Ausrichtung
                    // Elemente in Karte einfügen falls noch kein Element an dieser Stelle ist
                    if(editorStore.getters.getAusrichtung === 0) {
                        
                        this._karte.setElement(this._element.posY, this._element.posX, this._element.e)
                        this._karte.setElement(this._element.posY, this._element.posX-1, this._element.e)
                        this._karte.setElement(this._element.posY, this._element.posX+1, this._element.e)
                        this._karte.setElement(this._element.posY-1, this._element.posX, this._element.e)
                        this._karte.setElement(this._element.posY-1, this._element.posX-1, this._element.e)
                        this._karte.setElement(this._element.posY-1, this._element.posX+1, this._element.e)
                        // Hintergrund des Divs auf Farbe des Elements ändern
                        this._event.target.style = "background-color: rgba(238,59,59, 0.75);"
                        this._event.path[1].__vnode.children[0].children[this._element.posX+1].el.style = "background-color: rgba(238,59,59, 0.75);"
                        this._event.path[1].__vnode.children[0].children[this._element.posX-1].el.style = "background-color: rgba(238,59,59, 0.75);"
                        this._event.path[2].children[this._element.posY-1].children[this._element.posX].style = "background-color: rgba(238,59,59, 0.75);"
                        this._event.path[2].children[this._element.posY-1].children[this._element.posX-1].style = "background-color: rgba(238,59,59, 0.75);"
                        this._event.path[2].children[this._element.posY-1].children[this._element.posX+1].style = "background-color: rgba(238,59,59, 0.75);"
                        editorStore.info("Raum platziert.")
                        this._ausrichtung = 0;
                    
                    // Wenn vertikale Ausrichtung
                    // Elemente in Karte einfügen falls noch kein Element an dieser Stelle ist
                    } else {
                        this._karte.setElement(this._element.posY, this._element.posX, this._element.e)
                        this._karte.setElement(this._element.posY, this._element.posX-1, this._element.e)
                        this._karte.setElement(this._element.posY-1, this._element.posX, this._element.e)
                        this._karte.setElement(this._element.posY-1, this._element.posX-1, this._element.e)
                        this._karte.setElement(this._element.posY+1, this._element.posX, this._element.e)
                        this._karte.setElement(this._element.posY+1, this._element.posX-1, this._element.e)
                        // Hintergrund des Divs auf Farbe des Elements ändern
                        this._event.target.style = "background-color: rgba(238,59,59, 0.75);"
                        this._event.path[1].__vnode.children[0].children[this._element.posX-1].el.style = "background-color: rgba(238,59,59, 0.75);"
                        this._event.path[2].children[this._element.posY-1].children[this._element.posX].style = "background-color: rgba(238,59,59, 0.75);"
                        this._event.path[2].children[this._element.posY-1].children[this._element.posX-1].style = "background-color: rgba(238,59,59, 0.75);"
                        this._event.path[2].children[this._element.posY+1].children[this._element.posX].style = "background-color: rgba(238,59,59, 0.75);"
                        this._event.path[2].children[this._element.posY+1].children[this._element.posX-1].style = "background-color: rgba(238,59,59, 0.75);"
                        editorStore.info("Raum platziert.")
                        this._ausrichtung = 1
                    }
                    break;
                }
            }
        }
        else {
            editorStore.info("Bitte eine freie Stelle wählen!")
        }
        
    }

    /**
     * letzten Befehl rückgängig machen
     */
    undo = () => {
        this._state -= 1;
        // Element aus der Karte wieder auf 0 setzten (0 = Wand)
        // Hintergrund des divs auf Wand setzen
        switch (this._element.e) {
            // bei Weg, Start oder Ziel
            case 1:
            case 2:
            case 3: {
                this._karte.setElement(this._element.posY, this._element.posX, 0);  
                this._event.target.style = "background-color: rgba(92, 92, 92, 0.658);"
                break;
            }
            case 4:
            case 5:
            case 6:
            case 7:
            // Bei Raum
            case 8: {
                // wenn horizontrale Ausrichtung
                if(this._ausrichtung === 0) {
                    // Wand an der Stelle einfügen an der Element gesetzt wurde
                    this._karte.setElement(this._element.posY, this._element.posX, 0)
                    this._karte.setElement(this._element.posY, this._element.posX-1, 0)
                    this._karte.setElement(this._element.posY, this._element.posX+1, 0)
                    this._karte.setElement(this._element.posY-1, this._element.posX, 0)
                    this._karte.setElement(this._element.posY-1, this._element.posX-1, 0)
                    this._karte.setElement(this._element.posY-1, this._element.posX+1, 0)
                    // Hintergrund des Divs auf Wand Farbe ändern
                    this._event.target.style = "background-color: rgba(92, 92, 92, 0.658);"
                    this._event.path[1].__vnode.children[0].children[this._element.posX+1].el.style = "background-color: rgba(92, 92, 92, 0.658);"
                    this._event.path[1].__vnode.children[0].children[this._element.posX-1].el.style = "background-color: rgba(92, 92, 92, 0.658);"
                    this._event.path[2].children[this._element.posY-1].children[this._element.posX].style = "background-color: rgba(92, 92, 92, 0.658);"
                    this._event.path[2].children[this._element.posY-1].children[this._element.posX-1].style = "background-color: rgba(92, 92, 92, 0.658);"
                    this._event.path[2].children[this._element.posY-1].children[this._element.posX+1].style = "background-color: rgba(92, 92, 92, 0.658);"
                    editorStore.info("Raum platziert.")
                
                // Wenn vertikale Ausrichtung
                } else {
                    // Wand an der Stelle einfügen an der Element gesetzt wurde
                    this._karte.setElement(this._element.posY, this._element.posX, 0)
                    this._karte.setElement(this._element.posY-1, this._element.posX, 0)
                    this._karte.setElement(this._element.posY-1, this._element.posX+1, 0)
                    this._karte.setElement(this._element.posY-1, this._element.posX-1, 0)
                    this._karte.setElement(this._element.posY, this._element.posX+1, 0)
                    this._karte.setElement(this._element.posY, this._element.posX-1, 0)
                    // Hintergrund des Divs auf Wand Farbe ändern
                    this._event.target.style = "background-color: rgba(92, 92, 92, 0.658);"
                    this._event.path[1].__vnode.children[0].children[this._element.posX-1].el.style = "background-color: rgba(92, 92, 92, 0.658);"
                    this._event.path[2].children[this._element.posY-1].children[this._element.posX].style = "background-color: rgba(92, 92, 92, 0.658);"
                    this._event.path[2].children[this._element.posY-1].children[this._element.posX-1].style = "background-color: rgba(92, 92, 92, 0.658);"
                    this._event.path[2].children[this._element.posY+1].children[this._element.posX].style = "background-color: rgba(92, 92, 92, 0.658);"
                    this._event.path[2].children[this._element.posY+1].children[this._element.posX-1].style = "background-color: rgba(92, 92, 92, 0.658);"
                    editorStore.info("Raum platziert.")
                    
                }
                break;
            }
        }
        editorStore.info("letzten Schritt rückgängig gemacht")
    }

    // redo = () => {
    //     CommandStack.getInstance().getStack()[this._state].execute()
    // }

    /**
     * Beschreibung des Befehls
     * @returns hinzugefuegtes Objekt
     */
    describe = () => {
        const hinzugefuegt = {
            x: this._element.posX.toString(),
            y: this._element.posY.toString(),
            e:this._element.e.toString()
        }
        //console.log(this._ausrichtung)
        return "{ ["+hinzugefuegt.y+","+hinzugefuegt.x+"]"+" - "+hinzugefuegt.e+" }"
        
    }
}