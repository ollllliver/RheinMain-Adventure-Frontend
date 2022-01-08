import { useLobbyStore } from '@/services/LobbyStore';
import { Client, Message } from '@stomp/stompjs';
import { Spieler, Position } from './Spieler';
import user from '@/stores/user' 

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
        super.name = user.state.benutzername;
        console.log(`SpielerLokal: name=${this.name}, `)
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
                console.log(`SpielerLokal von ${DEST} empfangen`, message.body)
            });
            // this.stompclient.subscribe("/topic/spiel", (message) => { //Die Messages kommen hier an aber nicht im Backend
            //     console.log(message);
            // });
        };
        this.stompclient.activate();
    }

    async updatePosition (position: Position) {
        const DEST_POS = "/topic/spiel/" + this.lobbyID + '/pos/' + this.name;
        console.log(`SpielerLokal.updatePosition (${this.name}) gesendete: `, position);
        this.stompclient.publish({destination: DEST_POS, body: JSON.stringify(position), skipContentLengthHeader: true,});
    }

}