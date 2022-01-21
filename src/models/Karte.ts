/**
 * Karten-Klasse zur Datenhaltung von den platzierten Elementen auf der Karte
*/

export class Karte {
  private levelID: number
  private benutzerName: string
  private levelName: string
  private levelBeschreibung: string
  private levelInhalt: any[][];
  

  constructor(levelID: number, benutzername: string, levelname: string, beschreibung: string, liste: number[][]) {
    
      this.levelID = levelID
      this.benutzerName = benutzername
      this.levelName = levelname
      this.levelBeschreibung = beschreibung
      this.levelInhalt = liste


      // Liste wird erstellt -> testweise 14 Reihen und 22 Spalten (müssen wir dann klären wie groß eine Karte ist)

      for (let i = 0; i < 14; i++) {
        for (let j = 0; j < 22; j++) {
          if(liste[i][j] === null) {
            this.levelInhalt[i][j] = {y: i, x: j, e: 0}
          }
          else {
            this.levelInhalt[i][j] = {y: i, x: j, e: liste[i][j]}
          }
        }
      }
  }
  

  // liefert aktuelle Liste als zweidimensionales Array zurück
  public get liste():any[][] {
    return this.levelInhalt
  }

  public get _levelID():number {
    return this.levelID
  }
  public get _levelName():string {
    return this.levelName
  }

  public get _benutzername():string {
    return this.benutzerName
  }
  public get _levelBeschreibung():string {
    return this.levelBeschreibung
  }

  // setzt übergebenes Element an übergebener Position in der Liste
  public setElement(positionY: number, positionX: number, element: number, ausrichtung?: number):boolean {
    if (ausrichtung !== undefined) {
      this.levelInhalt[positionY][positionX] = {y: positionY, x: positionX, e: element}
    } else {
      this.levelInhalt[positionY][positionX] = {y: positionY,x: positionX, e: element,a: ausrichtung}
    }
    return true;
  }

  public setLevelName(levelname : string) {
    this.levelName = levelname
  }

  public setLevelBeschreibung(beschreibung : string) {
    this.levelBeschreibung = beschreibung
  }

  public wandleKarteZuInt() {
    for (let i = 0; i < 14; i++) {
      for (let j = 0; j < 22; j++) {
         this.levelInhalt[i][j] = this.levelInhalt[i][j].e
      }
    }
  }

  public wandleKarteZuObjekt() {
    for (let i = 0; i < 14; i++) {
      for (let j = 0; j < 22; j++) {
         this.levelInhalt[i][j] = {y: i, x: j, e: this.levelInhalt[i][j]}
      }
    }
  }

  

}
