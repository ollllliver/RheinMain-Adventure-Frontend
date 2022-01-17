/**
 * Karten-Klasse zur Datenhaltung von den platzierten Elementen auf der Karte
*/

export class Karte {
  private _liste: any[][];

  constructor() {
    this._liste = [];

    // Liste wird erstellt -> testweise 14 Reihen und 22 Spalten (müssen wir dann klären wie groß eine Karte ist)
    for (let i = 0; i < 14; i++) {
      this._liste[i] = [];
      for (let j = 0; j < 22; j++) {
        this._liste[i][j] = { y: i, x: j, e: 0 };
      }
    }
  }

  // liefert aktuelle Liste als zweidimensionales Array zurück
  public get liste():any[][] {
    return this._liste
  }

  // setzt übergebenes Element an übergebener Position in der Liste
  public setElement(positionY: number, positionX: number, element: number, ausrichtung?: number):boolean {
    if (ausrichtung !== undefined) {
      this._liste[positionY][positionX] = { y: positionY, x: positionX, e: element, a: ausrichtung }
    } else {
      this._liste[positionY][positionX] = { y: positionY, x: positionX, e: element }
    }
    return true;
  }

}
