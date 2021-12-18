/**
 * Karten-Klasse zur Datenhaltung von den platzierten Elementen auf der Karte
 */

export class Karte {
    private _liste: any[][];

    constructor() {
        this._liste = [];

        // Liste wird erstellt -> testweise 14 Spalten und 22 Reihen (müssen wir dann klären wie groß eine Karte ist)
        for(let i = 0; i < 14; i++) {
            this._liste[i] = [];
            for(let j = 0; j< 22; j++) {
                this._liste[i][j] = {x:i, y:j, e:0};
            }
        }
    }

    // liefert aktuelle Liste als zweidimensionales Array zurück
    public get liste() {
        return this._liste
    }

    // setzt übergebenes Element an übergebener Position in der Liste
    public setElement(positionX: number, positionY: number, element: number) {
        this._liste[positionX][positionY] = {x: positionX, y: positionY, e: element}
        return true;
    }
}