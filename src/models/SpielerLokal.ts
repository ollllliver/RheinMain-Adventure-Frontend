import { useLobbyStore } from '@/services/lobby/lobbyService';
import { Client, Message } from '@stomp/stompjs';
import { Spieler, Position } from '@/models/Spieler';
import { Camera } from "three/src/cameras/Camera";
import user from '@/stores/user' 
import { Euler, Vector3, EventDispatcher } from 'three';


const wsurl = `ws://${window.location.hostname}:8080/gamebroker`;
export const stompclient = new Client({ brokerURL: wsurl });

export class SpielerLokal extends Spieler{

    
    stompclient: Client;
    lobbyID: string;
    DEST = "/topic/spiel";

    _euler = new Euler(0, 0, 0, 'YXZ');

    camera: Camera;
    

    constructor(client: Client, camera: Camera){ 
        super();
    
        const { lobbystate } = useLobbyStore(); 
        this.lobbyID = lobbystate.lobbyID;
        super.name = user.state.benutzername;
        this.stompclient = client;
        this.camera = camera;

        camera.position.set(0, this.height * 3, 0);
        //camera.position.set(-2, spieler.height * 3, -5);
        camera.lookAt(new Vector3(-2, this.height * 3, 0));

        console.log(`SpielerLokal: name=${this.name}, `)
    }

    async updatePosition (position: Position) {
        const DEST_POS = "/topic/spiel/" + this.lobbyID + '/pos/' + this.name;
        this.stompclient.publish({destination: DEST_POS, body: JSON.stringify(position), skipContentLengthHeader: true,});
    }

    /**
     * Beweget die Kamera nach rechts
     * @param distance Wert wie weit die Kamera sich nach rechts bewegt
     */
    
    moveRight(distance:number) {
        //const distance = -delta * this.velocity.x;

        this._vector.setFromMatrixColumn(this.camera.matrix, 0);

        this.camera.position.addScaledVector(this._vector, distance);
    }

    move(delta:number) {
        this.moveRight(-this.velocity.x * delta)
        this.moveForward(-this.velocity.z * delta)
    }


    /**
     * Beweget die Kamera nach vorne
     * @param distance Wert wie weit die Kamera sich nach vorne bewegt
     */
    moveForward(distance:number) {
        //const distance = -delta*this.velocity.z;
        // bewegt  parallel zur xz-achse

        this._vector.setFromMatrixColumn(this.camera.matrix, 0);

        this._vector.crossVectors(this.camera.up, this._vector);

        this.camera.position.addScaledVector(this._vector, distance);
    }

    
}