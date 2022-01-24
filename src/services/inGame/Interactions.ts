import user from '@/stores/user';
import { Client } from '@stomp/stompjs';
import { Raycaster, Vector3, Mesh, Object3D, PerspectiveCamera } from 'three';
import { useLobbyStore } from '../lobby/lobbyService';
import { useGameEngine } from './gameEngine';

/**
 * Verarbeitet Interaktionsmoeglichkeiten
 */
export class Interactions {

    domElement: Document
    cameraCollidable: Mesh
    interaktionsListe: any
    erkannteInteraktion: any
    rayCaster: any;
    stompclient: Client
    lobbyID: string
    DEST: string
    index: number
    spielername: string
    update: (cameraPosition: any) => void
    keyDisconnect: () => void

    constructor(interaktionsListe: Array<Object3D>, cameraCollidable: Mesh, domElement: Document, client: Client) {

        const { disconnectController } = useGameEngine();
        const { lobbystate } = useLobbyStore()
        const { gamestate } = useGameEngine()
        
        const interaktionReichweite = 2
        let popupFenster: HTMLElement | null;

        this.spielername = user.state.benutzername;
        this.domElement = domElement;
        this.cameraCollidable = cameraCollidable;
        this.interaktionsListe = interaktionsListe;
        this.erkannteInteraktion = null;
        this.lobbyID = lobbystate.lobbyID;
        this.stompclient = client;
        this.DEST = "";
        this.index = 0;

        /**
         * Wird ausgelöst wenn eine Taste gedrückt wird
         * @param event Taste die gedrückt wurde
         */
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyE':
                    if (this.erkannteInteraktion) {
                        interagiere(this.erkannteInteraktion);
                    }
                    break;

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
            // TODO: Überprüfung nicht anhand vom Namen machen & hatSchluessel in eigene Inventar Klasse
            switch (interaktion.object.name) {
                // Jenachdem womit man interagiert wird eine StompNachricht an eine andere DEST gepublisht
                case "Schlüssel":
                    console.log("publish: " + interaktion.object.id + "auf /topic/spiel/" + this.lobbyID);
                    this.DEST = "/topic/spiel/" + this.lobbyID + "/" + interaktion.object.name;

                    // publisht den objektNamen auf die DEST /topic/spiel/{lobbyID}/key
                    console.log("Spieler " + this.spielername + "will den Schlüssel aufheben")
                    this.stompclient.publish({ destination: this.DEST, body: `${Math.round(interaktion.point.x).toString()};${Math.round(interaktion.point.z).toString()};${this.spielername}`, skipContentLengthHeader: true, });

                    break;
                case "Tür":
                    if (gamestate.anzSchluessel != 0) {

                        // öffne Tür (entferne Tür aus interaktionsListe)
                        this.index = interaktionsListe.indexOf(interaktion.object);
                        if (this.index > -1) {
                            interaktionsListe.splice(this.index, 1);
                        }
                    }
                    console.log("publish: " + interaktion.object.name + "auf /topic/spiel/" + this.lobbyID + '/' + interaktion.object.name);
                    this.DEST = "/topic/spiel/" + this.lobbyID + "/" + interaktion.object.name;

                    // publisht den objektNamen auf die DEST /topic/spiel/{lobbyID}/tuer
                    this.stompclient.publish({ destination: this.DEST, body: `${Math.round(interaktion.point.x).toString()};${Math.round(interaktion.point.z).toString()};${this.spielername}`, skipContentLengthHeader: true, });
                    break;
                case "Ziel":
                    
                    popupFenster = document.getElementById('ziel');
                    if(popupFenster){
                        popupFenster.style.display = "block";
                    }
                    disconnectController("ziel");
                    console.log("popup ist aktiviert");
                    break;
            }
        }

        this.update = (camera: PerspectiveCamera) => {
            const blickRichtung = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
            const originPoint = this.cameraCollidable.position.clone()
            const vorneVektor = blickRichtung.clone()

            this.rayCaster = new Raycaster(originPoint, vorneVektor, 0, interaktionReichweite)
            this.erkannteInteraktion = interaktionErkennung(vorneVektor, originPoint)
        }

        keyConnect()
    }
}
