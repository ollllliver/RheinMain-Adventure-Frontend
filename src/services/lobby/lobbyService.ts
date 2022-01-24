import { reactive, readonly } from 'vue'
import { Lobby } from '../../models/Lobby'
import { Spieler } from '@/models/Spieler'
import { LobbyMessage } from '@/messaging/LobbyMessage'
import { Client, StompSubscription } from '@stomp/stompjs';
import router from '@/router';
import userStore from '@/stores/user'
import {NachrichtenCode} from '@/messaging/NachrichtenCode';
import {NachrichtenTyp} from '@/messaging/NachrichtenTyp';
import {ChatNachricht} from '@/messaging/ChatNachricht';
import axios from 'axios';
import { ChatTyp, useChatStore } from "@/services/ChatStore";
import {ChatNachricht} from '@/messaging/ChatNachricht';
import { NachrichtenTyp } from '@/messaging/NachrichtenTyp';

let wsurl;
if (location.protocol == 'http:') {
    wsurl = `ws://${window.location.hostname}:8080/messagebroker`;
}else{
    wsurl = `wss://${window.location.hostname}/messagebroker`;
}
const { empfangeChatNachricht} = useChatStore();
const stompclient = new Client({brokerURL: wsurl});
const countdownDuration = 5;

/**
 * lobbystate ist ein reactive, das zu einer Lobby essentielle Infos hält + errormessage
 */
const lobbystate = reactive({
    // TODO: Level-Id (als Number)
    lobbyID: "",
    teilnehmerliste: Array<Spieler>(),
    host: {} as Spieler,
    istGestartet: false,
    istVoll: false,
    spielerlimit: 0,
    errormessage: "",
    // die darfBeitreten-Flag ist dafür, wenn jemand per Link joint, aber nicht joinen darf,
    // dass in dem Moment, bevor man zurück zur Übersicht gepusht wird, nichts angezeigt wird.
    darfBeitreten: false,
    istPrivat: false,
    countdown: countdownDuration,
    //TODO: any zu Karte oder Level ändern, sobald es im selben Branch ist.
    gewaehlteKarte: {} as any,
    subscriptionStatus: false
})

const {unsubscribeChat, subscribeChat} = useChatStore();

/**
 * alleLobbiesState ist ein reactive, das die Liste von Lobbys hält + errormessage
 */
const alleLobbiesState = reactive({
    lobbies: Array<Lobby>(),
    errormessage: ""
})

const alleKartenState = reactive({
    //TODO: any zu Karte oder Level ändern, sobald es im selben Branch ist.
    karten: {} as Array<any>,
})

// verwendete StompSubscriptions:
let lobbySubscription: StompSubscription;
let uebersichtSubscription: StompSubscription;

/**
 * connectToStomp ist die Function, in der der stompclient sich beim MessageBroker aus dem Backend einschreibt.
 * 
 * @param callb ist die Callback Function, die nach erfolgreichem Connecten mit dem MessageBroker ausgefühht wird.
 *              'callb' wird von connectToUebersicht() zum Beispiel zum subscriben verwendet.
 * @param param ist ein Parameter, der an deie callb Function weitergereicht wird.
 *              Scheinbar muss die in callb mitgegebene Function aber keinen Parameter erwarten.
 *              Nicht gerade so, wie man es von typescript kennt. Klingt mehr nach javascript. aber gut...
 */
async function connectToStomp(callb, param) {

    stompclient.onWebSocketError = () => { 
        console.log("AAAAAAAAAAAAAAAAAAAA websocket error")
        leaveLobby(); }
    stompclient.onStompError = (frame) => { 
        console.log("AAAAAAAAAAAAAAAAAAAA stomp error" + frame)
        leaveLobby();
    }
    stompclient.onDisconnect = () => {
        console.log("AAAAAAAAAAAAAAAAAAAA on disconnect")
        leaveLobby();
    }
    stompclient.onConnect = async (frame) => {
        console.log("Erfolgreich verbunden: " + frame);
        callb(param)
        console.log("Subscribe to", callb.name + "()");
    };
    stompclient.activate();
}

/**
 * connectToUebersicht subscribt sich mit zu Not selbst connectetem Stompclient mit der Function subscribeToUebersicht()
 */
function connectToUebersicht() {
    lobbystate.subscriptionStatus = false;
    if (!stompclient.connected) {
        connectToStomp(subscribeToUebersicht, null);
    }
    else {
        console.log("Subscribe to", subscribeToUebersicht.name + "()");
        subscribeToUebersicht();
    }
}

/**
 * subscribeToUebersicht schreibt sich für die nötigen topics die Lobbyübersicht per stompclient ein.
 */
function subscribeToUebersicht() {
    const DEST_UEB = "/topic/lobby/uebersicht";
    uebersichtSubscription = stompclient.subscribe(DEST_UEB, (message) => {
        empfangeLobbyMessageUebersicht(JSON.parse(message.body) as LobbyMessage);
    });
}

/**
 * Versucht über fetch der mitgegebenen Lobby zu joinen.
 * 
 * Mit dieser function wurde code aus der Function connectToLobby ausgelagert.
 * Der Code kann auch unabhänig von der anderen Function verwendet werden.
 * 
 * @param lobby_id 
 * @returns den Nachrichtencode der LobbyMessage, des fetchens auf join.
 * Bei Misserfolg, steht in der Lobbymessage das istFehler Flag auf true.
 */
async function tryJoin(lobby_id: string) {
    console.log("Fetch auf: /api/lobby/join/" + lobby_id);


    return axios.post('/api/lobby/join/' + lobby_id)
    .then((response) => {
        if (response.status != 200) {
            console.log("error");
            return;
        }
        return response.data;
    }).then((jsondata) => {
        // verarbeite jsondata
        const lobbymessage = jsondata as LobbyMessage;
        if (lobbymessage.istFehler) {
            return lobbymessage.typ;
        } else {
            return lobbymessage.typ;
        }
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

/**
 * Versucht, der mitgegebenen Lobby zu joinen und subscribt sich bei Erfolg
 * mit zu Not selbst connectetem Stompclient mit der Function subscribeToLobby()
 * und lädt die Daten der Lobby in das lobbyState reactive.
 * 
 * Bei Misserfolg wird auf die Übersichtseite gepusht und der Fehler als errormessage in Text gesetzt.
 * 
 * @param lobby_id ist die ID der Lobby, mit der sich verbunden werden soll und dessen Daten geladen werden sollen
 */
async function connectToLobby(lobby_id: string) {
    // erst versuchen, zu joinen

    tryJoin(lobby_id).then((res) => {
        switch (res) {
            case NachrichtenCode.LOBBY_VOLL:
                alleLobbiesState.errormessage = "Sorry, die Lobby war schon voll. Versuch es doch mal mit ner anderen :)";
                router.push("/uebersicht");
                break;

            case NachrichtenCode.BEITRETEN_FEHLGESCHLAGEN:
                alleLobbiesState.errormessage = "Es ist leider etwas schiefgelaufen.";
                router.push("/uebersicht");
                break;
            case NachrichtenCode.LOBBY_NICHT_GEFUNDEN:
                alleLobbiesState.errormessage = "Wir haben die Lobby leider nicht mehr gefunden.";
                router.push("/uebersicht");
                break;

            case NachrichtenCode.BEREITS_IN_ANDERER_LOBBY:
                alleLobbiesState.errormessage = "Du bist bereits in einer anderen Lobby";
                router.push("/uebersicht");
                break;

            case NachrichtenCode.SCHON_BEIGETRETEN:
            case NachrichtenCode.ERFOLGREICH_BEIGETRETEN:
                lobbystate.darfBeitreten = true;
                // Nach erfolgreichem joinen können wir die Ansicht wechseln und uns subscriben:
                router.push("/lobby/" + lobby_id);
                if (!stompclient.connected) {
                    connectToStomp(subscribeToLobby, lobby_id);
                }
                else {
                    uebersichtSubscription.unsubscribe();
                    console.log("Subscribe to", subscribeToLobby.name + "()");
                    subscribeToLobby(lobby_id);
                }
                // Chat fuer stomp subscriben:
                subscribeChat(lobby_id, ChatTyp.LOBBY);
                // und lobbydaten holen:
                updateLobby(lobby_id);
                alleLobbiesState.errormessage = '';
                lobbystate.errormessage = '';
                break;

            default:
                alleLobbiesState.errormessage = "Fehler noch nicht abgefangen. BITTE TICKET zu Item #109 öffnen und OLLI zuweisen!!! FEHLERCODE:" + res;
                router.push("/uebersicht");
                break;
        }
    });
}

/**
 * subscribeToLobby schreibt sich für die nötigen Topics für die mitgegebene Lobby per stompclient ein.
 * 
 * @param lobby_id ist die Lobby ID, für die sich eingeschrieben werden soll.
 */
function subscribeToLobby(lobby_id: string) {
    const DEST = "/topic/lobby/" + lobby_id;
    lobbySubscription = stompclient.subscribe(DEST, (message) => {
        const lobbymessage = JSON.parse(message.body) as LobbyMessage;
        empfangeLobbyMessageLobby(lobbymessage, lobby_id);
    });
}

/**
 * diese Methode behandelt über Stomp empfangene Lobbymessages zu einer Lobby
 * 
 * @param lobbymessage empfangene Lobbymessage
 * @param lobby_id zugehörige Lobby ID
 */
 function empfangeLobbyMessageLobby(lobbymessage: LobbyMessage, lobby_id: string) {
    console.log("message from broker topic lobby:", lobbymessage);
    if (lobbymessage.istFehler) {
        if(lobbymessage.typ == NachrichtenCode.LOBBYZEIT_ABGELAUFEN){
            alleLobbiesState.errormessage = "Die Lobby wurde aufgeloest da das Spiel nicht rechtzeitig gestartet wurde";
            resetLobbyID()
            router.push("/uebersicht");
        }else{
            lobbystate.errormessage = lobbymessage.typ;
        }
    }
    else {
        if (lobbymessage.typ == NachrichtenCode.MITSPIELER_VERLAESST && lobbymessage.payload == userStore.state.benutzername) {
            alleLobbiesState.errormessage = 'Du wurdest leider rausgeschmissen. :(';
            resetLobbyID()
            router.push("/uebersicht");
        } else if (lobbymessage.typ == NachrichtenCode.COUNTDOWN_GESTARTET){
            lobbystate.istGestartet = true;
            starteTimer();
        } else if (lobbymessage.typ == NachrichtenCode.BEENDE_SPIEL) {
            lobbystate.istGestartet = false;
            lobbySubscription.unsubscribe();
            unsubscribeChat();
            router.push("/lobby/" + lobbystate.lobbyID);
        }else if(lobbymessage.typ == NachrichtenCode.SCORE){
            const nachricht: ChatNachricht = { typ: NachrichtenTyp.CHAT, inhalt: lobbymessage.payload, sender: "Server" };
            console.log(lobbymessage.payload);
            empfangeChatNachricht(nachricht);
        } else {
            updateLobby(lobby_id);
            lobbystate.errormessage = '';
        }
    }
}

/**
 * Holt sich den Score String aus dem Backend und schickt ihn in den Chat.
 * 
 * @param lobby_id die ID der Lobby
 */
function getScore(lobby_id: string){
    fetch('/api/lobby/' + lobby_id + "/score", {
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
    }).then((lobbyMessage: LobbyMessage) => {
        empfangeLobbyMessageLobby(lobbyMessage, lobby_id);
    }).catch((e) => {
        console.log(e);
    });
}

/**
 * Rekursive Cowntdownmethode, die sich jede sekunde selbst aufruft und den lobbystate.countdown um 1 veringert.
 * Wird mit umleiten auf Spielansicht beendet, wenn lobbystate.countdown bei 0 ankommt.
 * 
 * @param delay 
 */
function starteTimer(delay = 1000) {
    if (lobbystate.countdown > 0) {
      setTimeout(() => {
        lobbystate.countdown -= 1;
        starteTimer();
      }, delay);
    } else {
      router.push("/environment");
      unsubscribeChat();
      lobbystate.countdown = countdownDuration;
    }
  }


/**
 * diese Methode behandelt über Stomp empfangene Lobbymessages zur Lobbyübersicht
 * 
 * @param lobbymessage empfangene Lobbymessage
 */
function empfangeLobbyMessageUebersicht(lobbymessage: LobbyMessage) {
    console.log("message from broker topic uebersicht:", lobbymessage);
    // Es gibt keine errormessages, die über diesen Kanal geteilt werden.
    alleLobbiesladen();
}

/**
 * lädt die Lobby Date der mitgegebenen Lobby neu in das lobbyState reactive.
 * 
 * @param lobby_id ist die ID der neu zu ladenden Lobby
 */
async function updateLobby(lobby_id: string) {
    console.log("Fetch auf: /api/lobby/" + lobby_id);


    axios.get('/api/lobby/' + lobby_id)
    .then((response) => {
        if (response.status != 200) {
            console.log("error");
            return;
        }
        return response.data;
    }).then((jsondata) => {
        // verarbeite jsondata
        lobbystate.teilnehmerliste = jsondata.teilnehmerliste;
        lobbystate.istGestartet = jsondata.istGestartet;
        lobbystate.istVoll = jsondata.istVoll;
        lobbystate.lobbyID = jsondata.lobbyID;
        lobbystate.spielerlimit = jsondata.spielerlimit;
        lobbystate.host = jsondata.host;
        lobbystate.istPrivat = jsondata.istPrivat;
        lobbystate.gewaehlteKarte = jsondata.gewaehlteKarte;
    }).catch((e) => {
        console.log(e);
    });

}

async function joinRandomLobby() {
    console.log("Fetch auf: /api/lobby/joinRandom");

    return axios.post('/api/lobby/joinRandom')
    .then((response) => {
        if (response.status != 200) {
            console.log("error");
            return;
        }
        return response.data;
    }).then((jsondata) => {
        const lobbyMsg = jsondata as LobbyMessage;
        if (lobbyMsg.istFehler) {
            alleLobbiesState.errormessage = "Keine passende Lobby gefunden. Erstell doch einfach selber eine.";
        }
        else {
            router.push("/lobby/" + lobbyMsg.payload);
        }
    })
        .catch((e) => {
            console.log(e);
        });

}

// starteSpiel?
async function starteLobby() {

    console.log("Fetch auf: /api/lobby/{lobbyId}/start")

    return axios.post('/api/lobby/'+lobbystate.lobbyID+'/start')
    .then((response) => {
        if (response.status != 200) {
            console.log("error");
            return;
        }
        return response.data;
    }).then(async (jsondata) => {
        const lobbyMsg = jsondata as LobbyMessage;
        return lobbyMsg.payload;

    }).catch((e) => {
            console.log(e);
        });

}

async function resetLobbyID() {
    return fetch('/api/lobby/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
        }
    })
}

function beendeSpiel() {
    const destination = "/topic/lobby/" + lobbystate.lobbyID;
    console.log(destination);
    stompclient.publish({destination: destination, body: JSON.stringify({typ: NachrichtenCode.BEENDE_SPIEL, istFehler: false, payload: "Kehre zurück zur Lobby"} as LobbyMessage)})
}

/**
 * resettet das reactive lobbyState.
 */
function resetLobbyState() {
    lobbystate.lobbyID = "";
    lobbystate.teilnehmerliste = Array<Spieler>();
    lobbystate.host = {} as Spieler;
    lobbystate.istGestartet = false;
    lobbystate.istVoll = false;
    lobbystate.spielerlimit = 0;
    lobbystate.errormessage = "";
    lobbystate.darfBeitreten = false;
    lobbystate.istPrivat = false;
}


/**
 * Fragt im Backend per fetch das verlassen der Lobby an.
 * 
 * @returns bei erfolgreichem Fetch die response als json.
 */
async function leaveLobby(): Promise<boolean> {
    if (lobbySubscription){
        lobbySubscription.unsubscribe();
    }
    
    unsubscribeChat();
    resetLobbyID();
    router.push("/uebersicht");



    return axios.delete('/api/lobby/leave/' + lobbystate.lobbyID)
    .then((response) => {
        if (response.status != 200) {
            console.log("error");
            return;
        }
        resetLobbyState();
        return response.data;
    }).catch((e) => {
        console.log(e);
    });
    


}

/**
 * Fragt im Backend per fetch das erstellen einer neuen Lobby an.
 * 
 * @returns bei erfolgreichem Fetch die LobbyID der im Backend neu erstellten Lobby
 */
async function neueLobby() {
    console.log("Fetch auf: /api/lobby/neu")

    

    return axios.post('/api/lobby/neu')
    .then((response) => {
        if (response.status != 200 ) {
            console.log("Fetch Error /api/lobby/alle");
            return;
        }
        return response.data;
    }).then((jsondata) => {
        const lobbymessage = jsondata as LobbyMessage;
        if (lobbymessage.istFehler) {
            alleLobbiesState.errormessage = "Du bist bereits in einer Lobby die ID lautet :" + lobbymessage.payload
            router.push("/uebersicht");
        } else {
            router.push("/lobby/" + lobbymessage.payload);
            return lobbymessage.payload
        }
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
    return axios.get('/api/lobby/alle')
    .then((response) => {
        if (response.status != 200 ) {
            console.log("Fetch Error /api/lobby/alle");
            return;
        }
        console.log("Fetchdaten /api/lobby/alle: " + response);
        return response.data;
    }).then((jsondata : Array<Lobby>)=> {
        console.log("Fetchdaten /api/lobby/alle: " + jsondata);
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
function changeLimit(neuesLimit) {
    console.log('change limit:', neuesLimit);

    axios.patch('/api/lobby/' + lobbystate.lobbyID + '/spielerlimit', neuesLimit)
    .then((response) => {
        if (response.status != 200) {
            console.log("error");
            return;
        }
        return response;
    }).catch((e) => {
        console.log(e);
    });
}

/**
 * Fragt im Backend per fetch das Ändern der istPrivat Variable für die Lobby aus dem aktuellen lobbystate an.
 * 
 * @param istPrivat 
 */
function changePrivacy(istPrivat) {
    console.log('change privacy:', istPrivat);


    axios.patch('/api/lobby/' + lobbystate.lobbyID + '/privacy', istPrivat)
    .then((response) => {
        if (response.status != 200) {
            console.log("error");
            return;
        }
        return response;
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
function changeHost(neuerHost) {
    console.log('change host:', neuerHost);

    axios.patch('/api/lobby/' + lobbystate.lobbyID + '/host', neuerHost)
    .then((response) => {
        if (response.status != 200) {
            console.log("error");
            return;
        }
        return response;
    }).then((json) => {
        console.log(json);
    }).catch((e) => {
        console.log(e);
    });

}

/**
 * Fragt im Backend per fetch das Entfernen des Spielers aus der Lobby an.
 * 
 * @param zuEntzfernenderSpieler 
 */
function spielerEntfernen(zuEntzfernenderSpieler: Spieler) {
    console.log('entferne Mitspieler:', zuEntzfernenderSpieler);

    
    axios.delete('/api/lobby/' + lobbystate.lobbyID + '/teilnehmer', { data: zuEntzfernenderSpieler })
    .then((response) => {
        if (response.status != 200) {
            console.log("error");
            return;
        }
        return response.data;
    }).then((lobbyMessage: LobbyMessage) => {
        if (lobbyMessage.istFehler) {
            lobbystate.errormessage = "Du darfst das nicht!";
            // Todo: vielleicht nen timer, der die nachricht nach 5 Sekunden entfernt?
        }
    }).catch((e) => {
        console.log(e);
    });

}

/**
 * Fragt im Backend per fetch das Ändern der gewählten Karte für die Lobby aus dem aktuellen lobbystate an.
 * 
 * @param neueKarte 
 */
 function changeKarte(neueKarte) {
    fetch('/api/lobby/' + lobbystate.lobbyID + '/level', {
        method: 'PATCH',
        // ,headers: {
        //     'Authorization': 'Bearer ' + loginstate.jwttoken
        // }
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(neueKarte.levelId)
    }).then((response) => {
        if (!response.ok) {
            console.log("error");
            return;
        }
        return response.json();
    }).catch((e) => {
        console.log(e);
    });
}

async function alleKartenLaden() {
    fetch('/api/level/alle', {
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
    }).then((level: Array<Lobby>) => {
        // verarbeite jsondata
        alleKartenState.karten = level;
    }).catch((e) => {
        console.log(e);
    });}

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
        lobbystate: readonly(lobbystate),
        alleKartenState: readonly(alleKartenState),

        // Lobby Funktionen zum Informieren
        alleLobbiesladen, connectToLobby, updateLobby, connectToUebersicht, getScore,

        // Lobby Funktionen zum Ändern
        neueLobby, joinRandomLobby, leaveLobby, starteLobby, beendeSpiel, spielerEntfernen,

        // Funktionen zum ändern der Lobby Einstellungen:
        einstellungsfunktionen: { changeLimit, changePrivacy, changeHost, changeKarte },

        alleKartenLaden,
    }
}
