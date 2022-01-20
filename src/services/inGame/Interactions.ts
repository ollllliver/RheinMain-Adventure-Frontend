import { Raycaster, Vector3 } from 'three';
import { useGameEngine } from './gameEngine';

/**
 * Verarbeitet Interaktionsmoeglichkeiten
 */
export class Interactions {

    domElement: Document
    cameraCollidable: any
    interaktionsListe: any
    erkannteInteraktion: any
    rayCaster: any
    update: (cameraPosition: any) => void
    keyDisconnect: () => void

    constructor(interaktionsListe: any, cameraCollidable: any, domElement: Document) {

        const { disconnectController } = useGameEngine();
        const interaktionReichweite = 2
        let hatSchluessel = false
        let popupFenster: any;

        this.domElement = domElement
        this.cameraCollidable = cameraCollidable
        this.interaktionsListe = interaktionsListe
        this.erkannteInteraktion = null

        /**
         * Wird ausgelöst wenn eine Taste gedrückt wird
         * @param event Taste die gedrückt wurde
         */
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {

                case 'KeyE':
                    if (this.erkannteInteraktion) {
                        interagiere(this.erkannteInteraktion)
                    }
                    break

            }
        };

        const keyConnect = () => {
            this.domElement.addEventListener('keydown', onKeyDown)
        };

        this.keyDisconnect = () => {
            this.domElement.removeEventListener('keydown', onKeyDown)
        };

        const interaktionErkennung = (blickVektor: any, originPoint: any) => {

            this.rayCaster.set(originPoint, blickVektor)

            const collisionResult = this.rayCaster.intersectObjects(interaktionsListe)

            if (collisionResult.length > 0) {
                return collisionResult[0]
            }

            return null
        }

        const interagiere = (interaktion: any) => {
            //TODO: Überprüfung nicht anhand vom Namen machen & hatSchluessel in eigene Inventar Klasse
            switch (interaktion.object.name) {
                case "Schlüssel":
                    hatSchluessel = true
                    interaktion.object.parent.remove(interaktion.object);
                    break;
                case "Tür":
                    if (hatSchluessel) {
                        hatSchluessel = false

                        // öffne Tür
                        interaktion.object.rotation.z = Math.PI / 2;

                        // entferne Tür aus interaktionsListe
                        const index = interaktionsListe.indexOf(interaktion.object);
                        if (index > -1) {
                            interaktionsListe.splice(index, 1);
                        }
                    } else {
                        //TODO: "Du benötigst einen Schlüssel" - Meldung
                    }
                    break;
                case "Ziel":
                    popupFenster = document.getElementById('ziel');
                    popupFenster.style.display = "block";
                    disconnectController("ziel");
                    console.log("popup ist aktiviert");
                    break;
            }
        }

        this.update = (camera: any) => {
            const blickRichtung = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
            const originPoint = this.cameraCollidable.position.clone()
            const vorneVektor = blickRichtung.clone()

            this.rayCaster = new Raycaster(originPoint, vorneVektor, 0, interaktionReichweite)
            this.erkannteInteraktion = interaktionErkennung(vorneVektor, originPoint)
        }

        keyConnect()
    }
}
