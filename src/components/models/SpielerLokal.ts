import { useLobbyStore } from '@/services/LobbyStore';
import { Client, Message } from '@stomp/stompjs';
import { Spieler, Position } from './Spieler';

export class SpielerLokal extends Spieler{
    stompclient: Client;
    lobbyID: string;
    DEST = "/topic/spiel";

    
    constructor(){ 
        super();
    
        const wsurl = `ws://localhost:8080/gamebroker`;
        this.stompclient = new Client({ brokerURL: wsurl })
        const { lobbystate } = useLobbyStore(); 
        this.lobbyID = lobbystate.lobbyID;
        this.name = lobbystate.host;
        this.connectToTeilnehmer();
        
        
  
    }

    async connectToTeilnehmer(){
        const DEST = "/topic/spiel/" + this.lobbyID;
        console.log("##### Subscribed auf Lobby ID: " + this.lobbyID + " #####")

        this.stompclient.onWebSocketError = () => {console.error("SpielerLokal.onWebSocketError")}
        this.stompclient.onStompError = () => { console.error("SpielerLokal.onStompError") }
        this.stompclient.onDisconnect = () => { console.error("SpielerLokal.onDisconnect") }
        this.stompclient.onConnect = async (frame) => {
            console.log("SpielerLokal erfolgreich verbunden: " + frame);
            this.stompclient.subscribe(DEST, (message) => { //subscribe zu jedem spieler einzeln oder alle zusammen?
                console.log(`SpielerLokal TEST von ${DEST} empfangen`, message)
            });
            // this.stompclient.subscribe("/topic/spiel", (message) => { //Die Messages kommen hier an aber nicht im Backend
            //     console.log(message);
            // });
        };
        this.stompclient.activate();
    }

    sendeTest(){
        this.stompclient.publish({destination: this.DEST, body: "TEST"});
        console.log(`SpielerLokal: TEST gesendet ${this.stompclient} -> ${this.DEST}`)
    }

    async updatePosition (position: Position) {
        const DEST_POS = "/topic/spiel/" + this.lobbyID + '/pos/' + "tim";
        //this.stompclient.publish({destination: "/topic/spiel/", body: JSON.stringify(position)});
        // try {
        //     this.stompclient.publish({destination: this.DEST, body: "TEST"});
        // } catch (e){
        //     console.error(e);
        // }
        console.log("SpielerLokal.updatePosition Gesendete Nachricht: ", position);
        this.stompclient.publish({destination: DEST_POS, body: JSON.stringify(position), skipContentLengthHeader: true,});
        // this.stompclient.publish({destination: "/topic/spiel", body: "TEST", skipContentLengthHeader: true,});
    }

}