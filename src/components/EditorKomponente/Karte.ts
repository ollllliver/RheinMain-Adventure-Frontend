export class Karte {
    private _liste: any[][];

    constructor() {
        this._liste = [];

        for(let i = 0; i < 14; i++) {
            this._liste[i] = [];
            for(let j = 0; j< 22; j++) {
                this._liste[i][j] = {x:i, y:j, e:0};
            }
        }
    }
    public get liste() {
        return this._liste
    }
    public setElement(positionX: number, positionY: number, element: number) {
        this._liste[positionX][positionY] = {x: positionX, y: positionY, e: element}
    }
}