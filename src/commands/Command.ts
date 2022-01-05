import { ICommand } from "./CommandManager";
import Demo from "@/components/Demo.vue";

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
