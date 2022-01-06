import { useLobbyStore } from '@/services/LobbyStore';
import { Client } from '@stomp/stompjs';
import { Spieler, Position } from './Spieler';

export class SpielerLokal extends Spieler{
    stompclient: Client;
    lobbyID: string;
    DEST = "/topic/spiel";

    
    constructor(){ 
        super();
    
        const wsurl = `ws://localhost:8080/gamebroker`;
        this.stompclient = new Client({ brokerURL: wsurl })
        this.connectToTeilnehmer();
        const { lobbystate } = useLobbyStore(); 
        this.lobbyID = lobbystate.lobbyID;
  
    }

    async connectToTeilnehmer(){

        this.stompclient.onWebSocketError = () => {console.error("SpielerLokal.onWebSocketError")}
        this.stompclient.onStompError = () => { console.error("SpielerLokal.onStompError") }
        this.stompclient.onDisconnect = () => { console.error("SpielerLokal.onDisconnect") }
        this.stompclient.onConnect = async (frame) => {
            console.log("SpielerLokalErfolgreich verbunden: " + frame);
            this.stompclient.subscribe(this.DEST, (message) => { //subscribe zu jedem spieler einzeln oder alle zusammen?
                console.log(`SpielerLokal TEST von ${this.DEST} empfangen`, message)
            });
        };
        this.stompclient.activate();
    }

    sendeTest(){
        this.stompclient.publish({destination: this.DEST, body: "TEST"});
        console.log(`SpielerLokal: TEST gesendet ${this.stompclient} -> ${this.DEST}`)
    }

    async updatePosition (position: Position) {
        // const DEST_POS = "/topic/spiel/" + this.lobbyID + '/pos/' + this.name;
        //this.stompclient.publish({destination: "/topic/spiel/", body: JSON.stringify(position)});
        try {
            this.stompclient.publish({destination: this.DEST, body: "TEST"});
        } catch (e){
            console.error(e);
        }
        console.log("SpielerLokal.updatePosition Gesendete Nachricht: ", position);
    }

}