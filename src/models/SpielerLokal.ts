import { useLobbyStore } from '@/services/lobby/lobbyService';
import { Client } from '@stomp/stompjs';
import { Spieler, Position } from '@/models/Spieler';
import user from '@/stores/user' 

let wsurl;
if (window.location.hostname == 'localhost') {
    wsurl = `ws://${window.location.hostname}:8080/gamebroker`;
}else{
    wsurl = `wss://${window.location.hostname}/gamebroker`;
}
export const stompclient = new Client({ brokerURL: wsurl });

export class SpielerLokal extends Spieler{
    stompclient: Client;
    lobbyID: string;
    DEST = "/topic/spiel";

    constructor(client: Client){ 
        super();
    
        const { lobbystate } = useLobbyStore(); 
        this.lobbyID = lobbystate.lobbyID;
        super.name = user.state.benutzername;
        this.stompclient = client;
        console.log(`SpielerLokal: name=${this.name}, `)
    }

    /**
     * Sendet eine neue Position für seinen eigenen Spieler an das Backend.
     * 
     * @param position seine eigene neue Position.
     */
    async updatePosition (position: Position) {
        const DEST_POS = "/topic/spiel/" + this.lobbyID + '/pos/' + this.name;
        this.stompclient.publish({destination: DEST_POS, body: JSON.stringify(position), skipContentLengthHeader: true,});
    }

}