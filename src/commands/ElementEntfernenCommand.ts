import { Karte } from "@/components/EditorKomponenten/Karte";
import { ICommand } from "./CommandManager";
import editorStore from '@/stores/editor';

export class ElementEntfernenCommand implements ICommand {

  private _state: number;
  private _karte: Karte;
  private _event: any;
  private _element: { posX: number, posY: number, e: number };

  /**
   * 
   * @param karte Karte welche bearbeitet wird
   * @param element element, dass entfernt werden soll
   * @param event event, auf dem das Entfernen durchgeführt wird.
   */
  constructor(karte: Karte, element: number, state: number, event: any, xPos?: number, yPos?: number) {
    this._state = state;
    this._karte = karte;
    this._event = event;
    if (xPos !== undefined && yPos !== undefined) {
      this._element = { posY: yPos, posX: xPos, e: element};
    } else {
      this._element = { posY: this._event.target.__vnode.key.y, posX: this._event.target.__vnode.key.x, e: element };
    }
  }

  execute = () => {
    this._state += 1;
    const pointedElement = this._karte.liste[this._element.posY][this._element.posX].e
    switch (pointedElement) {
      case 1: {
        this._karte.setElement(this._element.posY, this._element.posX, 0);
        this._event.target.style = "background-color: rgba(92, 92, 92, 0.658);"
        editorStore.info("Wegpunkt entfernt")
        console.log("Element mit Wert '" + pointedElement + "' angeklick");
        break;
      }
      case 2: {
        this._karte.setElement(this._element.posY, this._element.posX, 0);
        this._event.target.style = "background-color: rgba(92, 92, 92, 0.658);"
        editorStore.start(false);
        editorStore.info("Start entfernt")
        console.log("Element mit Wert '" + pointedElement + "' angeklick");
        break;
      }
      case 3: {
        this._karte.setElement(this._element.posY, this._element.posX, 0);
        this._event.target.style = "background-color: rgba(92, 92, 92, 0.658);"
        editorStore.ziel(false);
        editorStore.info("Ziel entfernt")
        console.log("Element mit Wert '" + pointedElement + "' angeklick");
        break;
      }
      case 4: {
        break;
      }
      case 5: {
        break;
      }
      case 6: {
        break;
      }
    }

    this._karte.liste[this._element.posY][this._element.posX].e == null;
    this._event.target.style = "background-color: rgba(92, 92, 92, 0.658);"
    editorStore.info("Element entfernt")
  }

  undo = () => {
    this._state -= 1;
    console.log("Entfernen UNDO ----- " + this._element.e);
    switch (this._element.e) {
      case 1: {
        this._karte.setElement(this._element.posY, this._element.posX, 1, 9);
        this._event.target.style = "background-color: rgba(255,211,155, 0.75);"
        break;
      }
      case 2: {
        this._karte.setElement(this._element.posY, this._element.posX, 2, 9);
        this._event.target.style = "background-color:rgba(37, 187, 31, 0.658);"
        editorStore.start(true);
        break;
      }
      case 3: {
        this._karte.setElement(this._element.posY, this._element.posX, 3, 9);
        this._event.target.style = "background-color:rgba(19, 30, 196, 0.658);"
        editorStore.ziel(true);
        break;
      }
    }
    editorStore.info("letzten Schritt rückgängig gemacht")
  }

  describe = () => {
    const entfernt = {
      x: this._element.posX.toString(),
      y: this._element.posY.toString(),
      e: this._element.e.toString()
    }
    return "{ [" + entfernt.y + "," + entfernt.x + "]" + " - " + entfernt.e + " }"
  }

  getStack(): ICommand[] {
    throw new Error("Method not implemented.");
  }

}
