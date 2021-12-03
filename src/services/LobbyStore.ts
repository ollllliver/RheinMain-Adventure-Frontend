import { reactive, readonly } from 'vue'
import { Lobby } from './Lobby'
import { Benutzer } from './Benutzer'
import { LobbyMessage } from './LobbyMessage'
import { Client } from '@stomp/stompjs';
import router from '@/router';
import { NachrichtenCode } from './NachrichtenCode';
import { NachrichtenTyp } from './NachrichtenTyp';
import { ChatNachricht } from './ChatNachricht';

const wsurl = `ws://localhost:8080/messagebroker`;
const stompclient = new Client({ brokerURL: wsurl })

const lobbystate = reactive({
    lobbyID: "",
    teilnehmerliste: Array<Benutzer>(),
    host: "",
    istGestartet: false,
    istVoll: false,
    spielerlimit: 0,
    errormessage: "",
    darfBeitreten: false
})

const alleLobbiesState = reactive({
    lobbies: Array<Lobby>(),
    errormessage: ""
})

async function connectToLobby(lobby_id: string) {
    console.log('jetzt connecting')
    const DEST = "/topic/lobby/" + lobby_id;
    const DEST_CHAT = "/topic/lobby/" + lobby_id + "/chat";

    stompclient.onWebSocketError = (event) => { /* WS-Fehler */ }
    stompclient.onStompError = (frame) => { /* STOMP-Fehler */ }
    stompclient.onDisconnect = () => { /* Verbindung abgebaut*/ }
    stompclient.onConnect = async (frame) => {
        console.log("Erfolgreich verbunden: " + frame);
        stompclient.subscribe(DEST, (message) => {
            const lobbymessage = JSON.parse(message.body) as LobbyMessage;
            console.log("message from broker:", lobbymessage);
            updateLobby(lobby_id);
        });
        stompclient.subscribe(DEST_CHAT, (message) => {
            const chatmessage = JSON.parse(message.body) as ChatNachricht;
            empfangeChatNachricht(chatmessage);
        });
    };
    stompclient.activate();


    console.log("Fetch auf: /api/lobby/join/" + lobby_id)
    fetch('/api/lobby/join/' + lobby_id, {
        method: 'POST'
        // ,headers: {
        //     'Authorization': 'Bearer ' + loginstate.jwttoken
        // }
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        return response.json();
    }).then((jsondata) => {
        // verarbeite jsondata
        const lobbymessage = jsondata as LobbyMessage;
        console.log("lobbymessage: ", lobbymessage)
        if(lobbymessage.istFehler){
            console.log(NachrichtenCode.LOBBY_VOLL)
            switch (lobbymessage.operation) {
                case NachrichtenCode.LOBBY_VOLL:
                    alleLobbiesState.errormessage = "Sorry, die Lobby war schon voll. Versuch es doch mal mit ner anderen :)"
                    router.push("/uebersicht")
                    break;
            
                default:
                    break;
            }
        }else{
            lobbystate.darfBeitreten = true;
            updateLobby(lobby_id);
        }

    })
        .catch((e) => {
            console.log(e);
        });


}


// TODO: Chatfunktionen auslagern in seperates ChatStore.ts
async function sendeChatNachricht(inhalt: string, sender: string) {

    const DEST_CHAT = "/topic/lobby/" + lobbystate.lobbyID + "/chat";
    const nachricht: ChatNachricht =  { typ: NachrichtenTyp.CHAT, inhalt: inhalt, sender: sender };
    stompclient.publish({destination: DEST_CHAT, body: JSON.stringify(nachricht)});
    console.log("Gesendete Nachricht: ", nachricht);
}

async function empfangeChatNachricht(nachricht: ChatNachricht) {

    console.log("Empfangene Nachricht: ", nachricht);
    
}

// Gemeinsame State-Variable(n) auf oberster Ebene,
// also ausserhalb der use-Funktion (dürfen nur je
// einmal und nicht nicht je use-Aufruf angelegt werden)
// Oft auch mit einem reactive()-Objekt gelöst

// Composition-Function zur Bereitstellung
// von State-Abfrage- und Bearbeitungsmoeglichkeiten

async function updateLobby(lobby_id: string) {
    console.log("Fetch auf: /api/lobby/" + lobby_id)
    fetch('/api/lobby/' + lobby_id, {
        method: 'GET'
        // ,headers: {
        //     'Authorization': 'Bearer ' + loginstate.jwttoken
        // }
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        return response.json();
    }).then((jsondata) => {
        console.log(jsondata)
        // verarbeite jsondata
        lobbystate.teilnehmerliste = jsondata.teilnehmerliste;
        lobbystate.istGestartet = jsondata.istGestartet;
        lobbystate.istVoll = jsondata.istVoll;
        lobbystate.lobbyID = jsondata.lobbyID;
        lobbystate.spielerlimit = jsondata.spielerlimit;
        lobbystate.host = jsondata.host;

    })
        .catch((e) => {
            console.log(e);
        });

}

async function joinLobby(benutzer: Benutzer): Promise<boolean> {
    console.log("Fetch auf: /lobby/" + lobbystate.lobbyID)
    return fetch('/lobby/' + lobbystate.lobbyID , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => response.text()
    ).then((res) =>{
        console.log(res);
        return true;
    }).catch((e) => {
        console.log("error:", e);
        return false;
    });
}




async function joinRandomLobby() {
    console.log("Fetch auf: /api/lobby/joinRandom")
    return fetch('/api/lobby/joinRandom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        return response.json();
    }).then((jsondata) => {
        const lobbyMsg = jsondata as LobbyMessage;
        console.log(lobbyMsg);
        return lobbyMsg.payload;

    })
        .catch((e) => {
            console.log(e);
        });

}

async function starteLobby() {
    console.log("Fetch auf: /api/lobby/{lobbyId}/start")
    return fetch('/api/lobby/'+lobbystate.lobbyID+'/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        return response.json();
    }).then((jsondata) => {
        const lobbyMsg = jsondata as LobbyMessage;
        console.log(lobbyMsg);
        return lobbyMsg.payload;

    })
        .catch((e) => {
            console.log(e);
        });

}



async function leaveLobby(spielername: string): Promise<boolean> {
    console.log("Fetch auf: " + lobbystate.lobbyID + "/leave"  )
    
    return fetch('/api/lobby/' + lobbystate.lobbyID + '/leave/' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        console.log("RRESPONSE: " + response)
        return response.json();
    }).catch((e) => {
            console.log(e);
        });
}



async function neueLobby() {
    console.log("/api/lobby/neu Data fetch:")
    return fetch('/api/lobby/neu', {
        method: 'POST'
        // ,headers: {
        //     'Authorization': 'Bearer ' + loginstate.jwttoken
        // }
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        return response.json();
    }).then((jsondata) => {
        return jsondata.lobbyID
    })
        .catch((e) => {
            console.log(e);
        });
}

async function alleLobbiesladen() {
    const lobbyliste = new Array<Lobby>();
    console.log("/api/lobby/alle anfragen")
    return fetch('/api/lobby/alle', {
        method: 'GET'
        // ,headers: {
        //     'Authorization': 'Bearer ' + loginstate.jwttoken
        // }
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        return response.json();
    }).then((jsondata: Array<Lobby>) => {
        console.log("jsondata:", jsondata);
        // verarbeite jsondata
        jsondata.forEach(element => {
            lobbyliste.push(element);
        });
        alleLobbiesState.lobbies = lobbyliste;

        return lobbyliste
    })
        .catch((e) => {
            console.log(e);
        });
}

export function useLobbyStore() {
    // auch hier könnten ref() und reactive() Objekte
    // angelegt werden, die dann nicht ueber mehrere
    // FE-Komponenten geshared, sondern je
    // Nutzerobjekt einzeln angelegt werden

    // nur diese Auswahl nach aussen geben
    return {
        lobbystate: readonly(lobbystate),
        connectToLobby,
        neueLobby,
        alleLobbiesladen,
        alleLobbiesState: readonly(alleLobbiesState),
        joinRandomLobby,updateLobby, joinLobby, leaveLobby,
        sendeChatNachricht, empfangeChatNachricht,starteLobby
    }
}
