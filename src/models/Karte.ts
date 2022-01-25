/**
 * Karten-Klasse zur Datenhaltung von den platzierten Elementen auf der Karte
 */

export class Karte {
  private levelID: number
  private benutzerName: string
  private levelName: string
  private levelBeschreibung: string
  private levelInhalt: any[][];


  constructor(levelID: number, benutzername: string, levelname: string, beschreibung: string) {

    this.levelID = levelID
    this.benutzerName = benutzername
    this.levelName = levelname
    this.levelBeschreibung = beschreibung
    this.levelInhalt = []

    // Liste initial erstellen -> testweise 14 Reihen und 22 Spalten (müssen wir dann klären wie groß eine Karte ist)
    for (let i = 0; i < 14; i++) {
      this.levelInhalt[i] = []
      for (let j = 0; j < 22; j++) {
        this.levelInhalt[i][j] = {y: i, x: j, e: 0}
      }
    }
  }


  // liefert aktuelle Liste als zweidimensionales Array zurück
  public get liste(): any[][] {
    return this.levelInhalt
  }

  public get _levelID(): number {
    return this.levelID
  }

  public get _levelName(): string {
    return this.levelName
  }

  public get _benutzername(): string {
    return this.benutzerName
  }

  public get _levelBeschreibung(): string {
    return this.levelBeschreibung
  }

  // setzt übergebenes Element an übergebener Position in der Liste
  public setElement(positionY: number, positionX: number, element: number, ausrichtung?: number): boolean {
    if (ausrichtung !== undefined) {
      this.levelInhalt[positionY][positionX] = {y: positionY, x: positionX, e: element, a: ausrichtung}
    } else {
      this.levelInhalt[positionY][positionX] = {y: positionY, x: positionX, e: element}
    }
    return true;
  }

  public setLevelId(levelID: number): void {
    this.levelID = levelID
  }

  public setLevelName(levelname: string): void {
    this.levelName = levelname
  }

  public setBenutzername(benutzername: string): void {
    this.benutzerName = benutzername
  }

  public setLevelBeschreibung(beschreibung: string): void {
    this.levelBeschreibung = beschreibung
  }

  public setLevelInhalt(inhalt: number[][]): void {
    for (let y = 0; y < 14; y++) {
      for (let x = 0; x < 22; x++) {
        this.levelInhalt[y][x] = {y: y, x: x, e: inhalt[y][x]}
      }
    }
  }

  public wandleKarteZuInt(): number[][] {
    const rueck: number[][] = []
    for (let i = 0; i < 14; i++) {
      rueck[i] = []
      for (let j = 0; j < 22; j++) {
        rueck[i][j] = this.levelInhalt[i][j].e
      }
    }
    return rueck
  }
}
