import { Client } from '@stomp/stompjs';
import {Vector3, Raycaster} from 'three';
import { useLobbyStore } from '../lobby/LobbyStore';
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
    stompclient:Client
    lobbyID:any
    anzahlSchluessel
    DEST:string
    index:any
    update: (cameraPosition: any) => void
    disconnect: () => void


    constructor(interaktionsListe: any, cameraCollidable: any, domElement: Document, client:Client) {

        const interaktionReichweite = 2
        
        

        this.domElement = domElement
        this.cameraCollidable = cameraCollidable
        this.interaktionsListe = interaktionsListe
        this.erkannteInteraktion = null
        const { lobbystate } = useLobbyStore();
        const { gamestate } = useGameEngine();
        this.lobbyID = lobbystate.lobbyID;
        this.anzahlSchluessel = gamestate.anzSchluessel;
        this.stompclient = client;
        this.DEST = ""
        this.index = null
        
         

        /**w
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
                
                console.log("ERKANNTE INTERAKTION: " + collisionResult[0].object)
                return collisionResult[0]
            }

            return null
        }

        const interagiere = (interaktion:any) => {
            
            
            switch (interaktion.object.name) {
                //Jenachdem womit man interagiert wird eine StompNachricht an eine andere DEST gepublisht
                case "Schlüssel":
                    interaktion.object.parent.remove(interaktion.object);
                    console.log("publish: " + interaktion.object.name + "auf /topic/spiel/" + this.lobbyID + '/schluessel');
                    this.DEST = "/topic/spiel/" + this.lobbyID + '/key';
                    //publisht den objektNamen auf die DEST /topic/spiel/{lobbyID}/key
                    this.stompclient.publish({destination: this.DEST, body: interaktion.object.name, skipContentLengthHeader: true,});
                    break;
                case "Tür":
                    if(gamestate.anzSchluessel !=  0){
                        // öffne Tür
                        interaktion.object.rotation.z = Math.PI / 2;

                        // entferne Tür aus interaktionsListe
                        this.index = interaktionsListe.indexOf(interaktion.object);
                        if (this.index > -1) {
                            interaktionsListe.splice(this.index, 1);
                                                                                }
                    }
                    
                    console.log("publish: " + interaktion.object.name + "auf /topic/spiel/" + this.lobbyID + '/tuer');
                    this.DEST = "/topic/spiel/" + this.lobbyID + '/tuer';
                    //publisht den objektNamen auf die DEST /topic/spiel/{lobbyID}/tuer
                    this.stompclient.publish({destination: this.DEST, body: interaktion.object.name, skipContentLengthHeader: true,});
                    break;

                    
            }
            
            
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