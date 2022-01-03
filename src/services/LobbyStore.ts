import { reactive, readonly } from 'vue'
import { Lobby } from './Lobby'
import { Benutzer } from './Benutzer'
import { LobbyMessage } from './LobbyMessage'
import { Client, StompSubscription } from '@stomp/stompjs';
import router from '@/router';
import { NachrichtenCode } from './NachrichtenCode';
import { NachrichtenTyp } from './NachrichtenTyp';
import { ChatNachricht } from './ChatNachricht';

const wsurl = `ws://localhost:8080/messagebroker`;
const stompclient = new Client({ brokerURL: wsurl });

// verwendete StompSubscriptions:
let lobbySubscription: StompSubscription;
let lobbyChatSubscription: StompSubscription;
let uebersichtSubscription: StompSubscription;

/**
 * lobbystate ist ein reactive, das zu einer Lobby essentielle Infos hält + errormessage
 */
const lobbystate = reactive({
    lobbyID: "",
    teilnehmerliste: Array<Benutzer>(),
    host: {} as Benutzer,
    istGestartet: false,
    istVoll: false,
    spielerlimit: 0,
    errormessage: "",
    darfBeitreten: false,
    istPrivat: false,
})

/**
 * alleLobbiesState ist ein reactive, das die Liste von Lobbys hält + errormessage
 */
const alleLobbiesState = reactive({
    lobbies: Array<Lobby>(),
    errormessage: ""
})

/**
 * connectToStomp ist die Function, in der der stomplient sich beim MessageBroker aus dem Backend einschreibt.
 * 
 * @param callb ist die Callback Function, die nach erfolgreichem Connecten mit dem MessageBroker ausgefühht wird.
 *              'callb' wird von connectToUebersicht() zum Beispiel zum subscriben verwendet.
 * @param param ist ein Parameter, der an deie callb Function weitergereicht wird.
 *              Scheinbar muss die in callb mitgegebene Function aber keinen Parameter erwarten.
 *              Nicht gerade so, wie man es von typescript kennt. Klingt mehr nach javascript. aber gut...
 */
async function connectToStomp(callb, param){
    // stompclient.onWebSocketError = () => { /* WS-Fehler */ }
    // stompclient.onStompError = () => { /* STOMP-Fehler */ }
    // stompclient.onDisconnect = () => { /* Verbindung abgebaut*/ }
    stompclient.onConnect = async (frame) => {
        console.log("Erfolgreich verbunden: " + frame);
<<<<<<< HEAD
        stompclient.subscribe(DEST, (message) => {
            const lobbymessage = JSON.parse(message.body) as LobbyMessage;
            console.log("message from broker:", lobbymessage);
            // checkCountdown(lobbymessage);
            updateLobby(lobby_id);
        });
        stompclient.subscribe(DEST_CHAT, (message) => {
            const chatmessage = JSON.parse(message.body) as ChatNachricht;
            empfangeChatNachricht(chatmessage);
        });
=======
        callb(param)
        console.log(callb.name + "()");
>>>>>>> b2fc9fcd808e11c6690b5c41125b5bc0692f0213
    };
    stompclient.activate();
}

/**
 * connectToUebersicht subscribt sich mit zu Not selbst connectetem Stompclient mit der Function subscribeToUebersicht()
 */
function connectToUebersicht(){
    if(!stompclient.connected){
        connectToStomp(subscribeToUebersicht, null)
    }
    else{
        console.log(subscribeToUebersicht.name + "()")
        subscribeToUebersicht()
    }
}

/**
 * subscribeToUebersicht schreibt sich für die nötigen topics die Lobbyübersicht per stompclient ein.
 */
 function subscribeToUebersicht() {
    const DEST_UEB = "/topic/lobby/uebersicht";
    uebersichtSubscription = stompclient.subscribe(DEST_UEB, (message) => {
        const lobbymessage = JSON.parse(message.body) as LobbyMessage;
        console.log("message from broker:", lobbymessage);
        alleLobbiesladen();
    });
}


/**
 * connectToLobby subscribt sich mit zu Not selbst connectetem Stompclient mit der Function subscribeToLobby()
 * und lädt die Daten der Lobby in das lobbyState reactive.
 * 
 * @param lobby_id ist die ID der Lobby, mit der sich verbunden werden soll und dessen Daten geladen werden sollen
 */
async function connectToLobby(lobby_id: string) {
    // erst versuchen, zu joinen
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
        if (lobbymessage.istFehler) {
<<<<<<< HEAD
            console.log(NachrichtenCode.LOBBY_VOLL)
=======
>>>>>>> b2fc9fcd808e11c6690b5c41125b5bc0692f0213
            switch (lobbymessage.typ) {
                case NachrichtenCode.LOBBY_VOLL:
                    alleLobbiesState.errormessage = "Sorry, die Lobby war schon voll. Versuch es doch mal mit ner anderen :)"
                    router.push("/uebersicht")
                    break;
                case NachrichtenCode.BEITRETEN_FEHLGESCHLAGEN:
                    alleLobbiesState.errormessage = "Es ist leider etwas schiefgelaufen."
                    router.push("/uebersicht")
                    break;

                default:
                    break;
            }
        } else {
            lobbystate.darfBeitreten = true;
            // nach erfolgreichem joinen können wir uns subscriben:
            if(!stompclient.connected){
                connectToStomp(subscribeToLobby, lobby_id)
            }
            else{
                console.log('unsubscribe von uebersicht')
                uebersichtSubscription.unsubscribe()
                console.log(subscribeToLobby.name + "()")
                subscribeToLobby(lobby_id)
            }
            // und lobbydaten holen:
            updateLobby(lobby_id);
        }
<<<<<<< HEAD
    }).catch((e) => {
        console.log(e);
    });
}

/*
function checkCountdown(lobbymessage: LobbyMessage) {
    if (lobbymessage.typ == NachrichtenCode.COUNTDOWN_GESTARTET) {
        lobbystate.countdownGestartet = true;
    }
}
*/
=======

    })
        .catch((e) => {
            console.log(e);
        });
}

/**
 * subscribeToLobby schreibt sich für die nötigen Topics für die mitgegebene Lobby per stompclient ein.
 * 
 * @param lobby_id ist die Lobby ID, für die sich eingeschrieben werden soll.
 */
function subscribeToLobby(lobby_id: string){
    const DEST = "/topic/lobby/" + lobby_id;
    const DEST_CHAT = "/topic/lobby/" + lobby_id + "/chat";
    lobbySubscription = stompclient.subscribe(DEST, (message) => {
        const lobbymessage = JSON.parse(message.body) as LobbyMessage;
        console.log("message from broker:", lobbymessage);
        updateLobby(lobby_id);
    });
    lobbyChatSubscription = stompclient.subscribe(DEST_CHAT, (message) => {
        const chatmessage = JSON.parse(message.body) as ChatNachricht;
        empfangeChatNachricht(chatmessage);
    });
}
>>>>>>> b2fc9fcd808e11c6690b5c41125b5bc0692f0213

// TODO: Chatfunktionen auslagern in seperates ChatStore.ts
async function sendeChatNachricht(typ: NachrichtenTyp, inhalt: string, sender: string) {

    const DEST_CHAT = "/topic/lobby/" + lobbystate.lobbyID + "/chat";
    const nachricht: ChatNachricht = { typ: typ, inhalt: inhalt, sender: sender };
    stompclient.publish({ destination: DEST_CHAT, body: JSON.stringify(nachricht) });
    console.log("Gesendete Nachricht: ", nachricht);
}

async function empfangeChatNachricht(nachricht: ChatNachricht) {

    console.log("Empfangene Nachricht: ", nachricht);
    const messageArea = document.getElementById("messageArea");
    const messageElement = document.createElement("li");

    if (nachricht.typ == 'JOIN') {
        messageElement.classList.add('event-message');
        messageElement.innerHTML = nachricht.sender.bold() + ' ist gejoined!';
    } else if (nachricht.typ == 'LEAVE') {
        messageElement.classList.add('event-message');
        messageElement.innerHTML = nachricht.sender.bold() + ' ist geleaved!';
    } else {
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = nachricht.sender.bold() + ": " + nachricht.inhalt;
    }

    let nachUntenGescrollt;

    if (messageArea) {
        if ((messageArea.offsetHeight + messageArea.scrollTop) >= messageArea.scrollHeight - 20) {
            nachUntenGescrollt = true;
        } else {
            nachUntenGescrollt = false;
        }

        messageArea.appendChild(messageElement);
    }

    if (nachUntenGescrollt) {
        messageElement.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * lädt die Lobby Daten der mitgegebenen Lobby neu in das lobbyState reactive.
 * 
 * @param lobby_id ist die ID der neu zu ladenden Lobby
 */
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
        lobbystate.istPrivat = jsondata.istPrivat;

    }).catch((e) => {
        console.log(e);
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

    }).catch((e) => {
        console.log(e);
    });
}

async function starteLobby() {
<<<<<<< HEAD
    console.log("Fetch auf: /api/lobby/{lobbyId}/start")
=======
    console.log('Fetch auf: /api/lobby/' + lobbystate.lobbyID + '/start')
>>>>>>> b2fc9fcd808e11c6690b5c41125b5bc0692f0213
    return fetch('/api/lobby/' + lobbystate.lobbyID + '/start', {
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
    }).then(async (jsondata) => {
        const lobbyMsg = jsondata as LobbyMessage;
        console.log(lobbyMsg);
        return lobbyMsg.payload;
<<<<<<< HEAD
    }).catch((e) => {
        console.log(e);
    });
}

=======

    })
        .catch((e) => {
            console.log(e);
        });
}

/**
 * resettet das reactive lobbyState.
 */
>>>>>>> b2fc9fcd808e11c6690b5c41125b5bc0692f0213
function resetLobbyState() {
    lobbystate.lobbyID = "";
    lobbystate.teilnehmerliste = Array<Benutzer>();
    lobbystate.host = {} as Benutzer;
    lobbystate.istGestartet = false;
    lobbystate.istVoll = false;
    lobbystate.spielerlimit = 0;
    lobbystate.errormessage = "";
    lobbystate.darfBeitreten = false;
    lobbystate.istPrivat = false;
}

<<<<<<< HEAD
=======

/**
 * Fragt im Backend per fetch das verlassen der Lobby an.
 * 
 * @returns bei erfolgreichem Fetch die response als json.
 */
>>>>>>> b2fc9fcd808e11c6690b5c41125b5bc0692f0213
async function leaveLobby(): Promise<boolean> {
    lobbySubscription.unsubscribe()
    lobbyChatSubscription.unsubscribe()

    console.log("Fetch auf: /leave/" + lobbystate.lobbyID)
    router.push("/uebersicht");
    return fetch('/api/lobby/leave/' + lobbystate.lobbyID, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        resetLobbyState();
        return response.json();
    }).catch((e) => {
        console.log(e);
    });
}

<<<<<<< HEAD
=======
/**
 * Fragt im Backend per fetch das erstellen einer neuen Lobby an.
 * 
 * @returns bei erfolgreichem Fetch die LobbyID der im Backend neu erstellten Lobby
 */
>>>>>>> b2fc9fcd808e11c6690b5c41125b5bc0692f0213
async function neueLobby() {
    console.log("Fetch auf: /api/lobby/neu")
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
        console.log(jsondata)
        return jsondata.lobbyID
    }).catch((e) => {
        console.log(e);
    });
}

/**
 * updated das reaktive alleLobbiesState.
 * 
 * @returns eine Liste der lobbys
 */
async function alleLobbiesladen() {
    const lobbyliste = new Array<Lobby>();
    console.log("Fetch auf: /api/lobby/alle")
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
        console.log(jsondata);
        // verarbeite jsondata
        jsondata.forEach(element => {
            lobbyliste.push(element);
        });
        alleLobbiesState.lobbies = lobbyliste;

        return lobbyliste
    }).catch((e) => {
        console.log(e);
    });
}

/**
 * Fragt im Backend per fetch das Ändern des spielerlimits für die Lobby aus dem aktuellen lobbystate an.
 * 
 * @param neuesLimit 
 */
function changeLimit(neuesLimit){
    console.log('change limit:', neuesLimit);
    fetch('/api/lobby/'+ lobbystate.lobbyID + '/spielerlimit', {
        method: 'PATCH',
        // ,headers: {
        //     'Authorization': 'Bearer ' + loginstate.jwttoken
        // }
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(neuesLimit)
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        return response.json();
    }).then((json) => {
        console.log(json);
    }).catch((e) => {
        console.log(e);
    });
}

/**
 * Fragt im Backend per fetch das Ändern der istPrivat Variable für die Lobby aus dem aktuellen lobbystate an.
 * 
 * @param istPrivat 
 */
function changePrivacy(istPrivat){
    console.log('change privacy:', istPrivat);
    fetch('/api/lobby/'+ lobbystate.lobbyID + '/privacy', {
        method: 'PATCH',
        // ,headers: {
        //     'Authorization': 'Bearer ' + loginstate.jwttoken
        // }
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(istPrivat)
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        return response.json();
    }).then((json) => {
        console.log(json);
    }).catch((e) => {
        console.log(e);
    });
}

/**
 * Fragt im Backend per fetch das Ändern des Host für die Lobby aus dem aktuellen lobbystate an.
 * 
 * @param neuerHost 
 */
function changeHost(neuerHost){
    console.log('change host:', neuerHost);
    fetch('/api/lobby/'+ lobbystate.lobbyID + '/host', {
        method: 'PATCH',
        // ,headers: {
        //     'Authorization': 'Bearer ' + loginstate.jwttoken
        // }
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(neuerHost)
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        return response.json();
    }).then((json) => {
        console.log(json);
    }).catch((e) => {
        console.log(e);
    });
}

/**
 * stellt mit dem returnobjekt gewisse objekte und functionen für die Views und Componenten zur Verfügung
 * 
 * @returns Return-Objekt mit den zur verfügung zu stellenden Objekten.
 */
export function useLobbyStore() {
    // auch hier könnten ref() und reactive() Objekte
    // angelegt werden, die dann nicht ueber mehrere
    // FE-Komponenten geshared, sondern je
    // Nutzerobjekt einzeln angelegt werden

    // nur diese Auswahl nach aussen geben
    return {
        // State-Variablen:
        alleLobbiesState: readonly(alleLobbiesState),
<<<<<<< HEAD
        joinRandomLobby, updateLobby, leaveLobby,
        sendeChatNachricht, empfangeChatNachricht, starteLobby,
=======
        lobbystate: readonly(lobbystate),

        // Lobby Funktionen zum Informieren
        alleLobbiesladen, connectToLobby, updateLobby, connectToUebersicht,

        // Lobby Funktionen zum Ändern
        neueLobby, joinRandomLobby, leaveLobby, starteLobby,

        // Funktionen zum ändern der Lobby Einstellungen:
        einstellungsfunktionen: {changeLimit, changePrivacy, changeHost},

        // Chat Funktionen:
        sendeChatNachricht, empfangeChatNachricht,
>>>>>>> b2fc9fcd808e11c6690b5c41125b5bc0692f0213
    }
}
