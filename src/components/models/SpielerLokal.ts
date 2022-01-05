import { useLobbyStore } from '@/services/LobbyStore';
import { Client } from '@stomp/stompjs';
import { Spieler, Position } from './Spieler';

export class SpielerLokal extends Spieler{
    stompclient: Client;
    lobbyID: string;

    
    constructor(){ 
        super();
    
        const wsurl = `ws://localhost:8080/gamebroker`;
        this.stompclient = new Client({ brokerURL: wsurl })
        this.connectToTeilnehmer();
        const { lobbystate } = useLobbyStore(); 
        this.lobbyID = lobbystate.lobbyID;
  
    }

    async connectToTeilnehmer(){
        const DEST = "/topic/spiel/" + this.lobbyID;

        this.stompclient.onWebSocketError = () => { /* WS-Fehler */ }
        this.stompclient.onStompError = () => { /* STOMP-Fehler */ }
        this.stompclient.onDisconnect = () => { /* Verbindung abgebaut*/ }
        this.stompclient.onConnect = async (frame) => {
            console.log("Erfolgreich verbunden: " + frame);
            this.stompclient.subscribe(DEST, (message) => { //subscribe zu jedem spieler einzeln oder alle zusammen?
                console.log(message);
            });
        };
        this.stompclient.activate();
    }


    async updatePosition (position: Position) {
        const DEST_POS = "/topic/spiel/" + this.lobbyID + '/pos/' + this.name;
        //this.stompclient.publish({destination: "/topic/spiel/", body: JSON.stringify(position)});
        try {
            this.stompclient.publish({destination: "/topic/spiel/", body: "TEST"});
        } catch (e){
            console.error(e);
        }
        console.log("Gesendete Nachricht: ", position);
    }

}