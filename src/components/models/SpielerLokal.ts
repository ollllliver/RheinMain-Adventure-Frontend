import { useLobbyStore } from '@/services/LobbyStore';
import { Client } from '@stomp/stompjs';
import { Spieler, Position } from './Spieler';

export class SpielerLokal extends Spieler{
    stompclient: Client;
    lobbyID: string;
    DEST = "/topic/spiel/";

    
    constructor(){ 
        super();
    
        const wsurl = `ws://localhost:8080/gamebroker`;
        this.stompclient = new Client({ brokerURL: wsurl })
        this.connectToTeilnehmer();
        const { lobbystate } = useLobbyStore(); 
        this.lobbyID = lobbystate.lobbyID;
  
    }

    async connectToTeilnehmer(){

        this.stompclient.onWebSocketError = () => { /* WS-Fehler */ }
        this.stompclient.onStompError = () => { /* STOMP-Fehler */ }
        this.stompclient.onDisconnect = () => { /* Verbindung abgebaut*/ }
        this.stompclient.onConnect = async (frame) => {
            console.log("Erfolgreich verbunden: " + frame);
            this.stompclient.subscribe(this.DEST, (message) => { //subscribe zu jedem spieler einzeln oder alle zusammen?
                console.log('TEST empfangen', message)
            });
        };
        this.stompclient.activate();
    }

    sendeTest(){
        this.stompclient.publish({destination: this.DEST, body: "TEST"});
        console.log('TEST gesendet')
    }

    async updatePosition (position: Position) {
        // const DEST_POS = "/topic/spiel/" + this.lobbyID + '/pos/' + this.name;
        //this.stompclient.publish({destination: "/topic/spiel/", body: JSON.stringify(position)});
        try {
            this.stompclient.publish({destination: this.DEST, body: "TEST"});
        } catch (e){
            console.error(e);
        }
        console.log("Gesendete Nachricht: ", position);
    }

}