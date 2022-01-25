import { Spieler } from '@/models/Spieler';
import { Client, StompSubscription } from '@stomp/stompjs';
import { useLobbyStore } from '@/services/lobby/lobbyService';
import { useGameEngine } from './gameEngine';
import userStore from '@/stores/user'

let wsurl;
if (location.protocol == 'http:') {
    wsurl = `ws://${window.location.hostname}:8080/gamebroker`;
}else{
    wsurl = `wss://${window.location.hostname}/gamebroker`;
}

export const gamebrokerStompclient = new Client({ brokerURL: wsurl });
export const schluesselStompclient = new Client({ brokerURL: wsurl });
const { setzeMitspielerAufPosition, setzteSchluesselAnz, oeffneTuer, setzteWarnText } = useGameEngine();
const { lobbystate } = useLobbyStore();
let schluesselSubscription: StompSubscription;
let positionSubscription: StompSubscription;

/**
 * Schribt sich bei STOMP auf das Topic /topic/spiel/{lobbyID} ein
 * 
 * @param stompclient 
 */
export function subscribeToSpielerPositionenUpdater(stompclient: Client): void{
    if (stompclient.connected){
        positionSubscription.unsubscribe()
        spielerSubCallback(stompclient);
    }else{
        stompclient.onConnect = async () => {
            spielerSubCallback(stompclient);
        }
    }
}

function spielerSubCallback(stompclient: Client) :void{
    const DEST = "/topic/spiel/" + lobbystate.lobbyID;
    positionSubscription = stompclient.subscribe(DEST, (message) => {
        const spieler: Spieler = JSON.parse(message.body);
        if (spieler.name!= userStore.state.benutzername){
            setzeMitspielerAufPosition(spieler)
        }
    });
}

export function subscribeToSchluesselUpdater(stompclient: Client): void{
    if (stompclient.connected){
        schluesselSubscription.unsubscribe()
        schluesselSubCallback(stompclient);
    }else{
        stompclient.onConnect = async () => {
            schluesselSubCallback(stompclient);
        }
    }
}

function schluesselSubCallback(stompclient: Client): void{
    const DEST = "/topic/spiel/" + lobbystate.lobbyID + "/schluessel";
    schluesselSubscription = stompclient.subscribe(DEST, (message) => {
        const update: any = JSON.parse(message.body);
        //Jenachdem wie viele Schluessel eingesammelt wurden:
        //TODO Abfrage lieber im Backend??
        switch (update.objectName) {
            case "Schlüssel":
                //Wenn mit Schluessel interagiert wurde dann wird der Zaehler bei allen erhoeht
                console.log("ANTWORT VOM SERVER ANZAHL SCH: " + update.anzSchluessel + "::::::" +  update.koordinatenArray + "::::::" + update.objectName)
                setzteSchluesselAnz(update.anzSchluessel, update.koordinatenArray); 
                break;
            case "Tür":
                //wenn mit Tuer interagiert wurde wird Sie geöffnet 
                console.log("ANTWORT VOM SERVER ANZAHL SCH: " + update.anzSchluessel + "::::::" +  update.koordinatenArray + "::::::" + update.objectName)
                oeffneTuer(update.anzSchluessel, update.koordinatenArray); 
                break;
            case "Warnung":
                console.log("KEINE SCHLÜSSEL");
                setzteWarnText();
                break;
        }
    });
}