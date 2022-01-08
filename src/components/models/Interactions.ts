import {Vector3, Raycaster} from 'three';

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
    disconnect: () => void


    constructor(interaktionsListe: any, cameraCollidable: any, domElement: Document) {

        const interaktionReichweite = 2

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
                    if(this.erkannteInteraktion){
                        interagiere(this.erkannteInteraktion)
                    }
                    break

            }
        };

        const connect = () => {
            this.domElement.addEventListener('keydown', onKeyDown)
        };

        this.disconnect = () => {
            this.domElement.removeEventListener('keydown', onKeyDown)
        };

        const interaktionErkennung = (blickVektor:any, originPoint: any) => {

            this.rayCaster.set(originPoint, blickVektor)

            const collisionResult = this.rayCaster.intersectObjects(interaktionsListe)

            if (collisionResult.length > 0){
                return collisionResult[0]
            }

            return null
        }

        const interagiere = (interaktion:any) => {
            //TODO: Interaktion
            interaktion.object.position.x += 0.5
        }

        this.update = (camera: any) => {

            const blickRichtung = new Vector3(0,0,-1).applyQuaternion(camera.quaternion)

            const originPoint = this.cameraCollidable.position.clone()

            const vorneVektor = blickRichtung.clone()

            this.rayCaster = new Raycaster(originPoint, vorneVektor, 0, interaktionReichweite)

            this.erkannteInteraktion = interaktionErkennung(vorneVektor, originPoint)
        }

        connect()
    }
}