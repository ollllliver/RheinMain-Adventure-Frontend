import { ICommand } from "./CommandManager";
import {Karte} from '../components/EditorKomponente/Karte'
import editorStore from '@/stores/editor'

/*
 * Jeder Befehl bekommt seine eigene Klasse und implementiert das ICommand Interface
 */

/**
 * Nur zu Testzwecken und als Beispiel
 */
export class ConcreteCommandTest implements ICommand{
    private _state: {x:number };

    constructor(state: {x:number }){
        this._state = state;
    }

    execute = () => {
        this._state.x += 1;
    }

    undo = () => {
        this._state.x -= 1;
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
    private _karte: Karte
    private _element: {posX: number, posY: number, e: number}
    private _event: any

    /**
     * 
     * @param karte  Karte auf der bearbeitet wird
     * @param element element das einzufügen ist (1 = Weg, 2 = Start, 3 = Ziel)
     * @param event event auf dem das Einfügen stattfindet (kann man bestimmt besser lösen)
     */

    constructor(karte: Karte , element: number, event: any) {
        this._state = 0;
        this._karte = karte;
        this._event = event
        this._element = {posX: this._event.target.__vnode.key.x, posY: this._event.target.__vnode.key.y, e: element}
    }

    /**
     * Befehl ausführen
     */
    execute = () => {
        // Braucht man für CommandManager ?
        this._state += 1;

        // Elemente in Karte einfügen
        this._karte.setElement(this._element.posX, this._element.posY, this._element.e);

        // Hintergrund des Divs auf Farbe des Elements ändern
        switch (this._element.e) {
            case 1: {
                this._event.target.style = "background-color: rgba(155, 70, 14, 1);"
                break;
            }
            case 2: {
                this._event.target.style = "background-color:rgba(37, 187, 31, 0.658);"
                break;
            }
            case 3: {
                this._event.target.style = "background-color:rgba(19, 30, 196, 0.658);"
                break;
            }
        }
    }

    /**
     * letzten Befehl rückgängig machen
     */
    undo = () => {
        this._state -= 1;
        // Element aus der Karte wieder auf 0 setzten (0 = Wand)
        this._karte.setElement(this._element.posX, this._element.posY, 0)

        // Hintergrund des divs auf Wand setzen
        this._event.target.style = "background-color: rgba(92, 92, 92, 0.658);"
    }

    /**
     * letzten Befehl wiederherstellen
     */
    redo = () => {
        this.execute()
    }

    /**
     * 
     * @returns hinzugefuegtes Objekt
     */
    describe = () => {
        const hinzugefuegt = {
            x: this._element.posX.toString(),
            y: this._element.posY.toString(),
            e:this._element.e.toString()
        }
        return "["+hinzugefuegt.x+","+hinzugefuegt.y+"]"+"-"+hinzugefuegt.e
    }
}