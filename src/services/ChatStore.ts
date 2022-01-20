import { Client, StompSubscription } from '@stomp/stompjs';
import {NachrichtenTyp} from '@/messaging/NachrichtenTyp';
import {ChatNachricht} from '@/messaging/ChatNachricht';

const wsurl = `ws://localhost:8080/messagebroker`;
const stompclient = new Client({brokerURL: wsurl});

// verwendete StompSubscription
let chatSubscription: StompSubscription;

let aktLobbyID = "";
let DEST_CHAT = "";

/**
 * Typ eines Chats, je nachdem ob der Chat in der Lobby oder im Spiel verwendet wird
 */
export enum ChatTyp {
    LOBBY,
    INGAME
}
/**
 * subscribeChat ist einMethode die nach außen gegeben wird um eine Stompverbindung
 * fuer den Chat aufzubauen, sie bekommt die aktuelle LobbyID sowie den Typ des Chats uebergeben
 * @param lobby_id 
 * @param typ ChatTyp (LOBBY, INGAME)
 */
function subscribeChat(lobby_id: string, typ: ChatTyp){
    aktLobbyID = lobby_id;

    switch (typ) {
        case ChatTyp.LOBBY:
            DEST_CHAT = "/topic/lobby/" + lobby_id + "/chat";
            break;
        case ChatTyp.INGAME:
            DEST_CHAT = "/topic/spiel/" + lobby_id + "/chat";
            break;
    }

    if(!stompclient.connected){
        connectChatToStomp(subscribeStompChat, lobby_id);
    }else{
        subscribeStompChat(lobby_id);
    }
}

/**
 * connectChatToStomp ist die Function, in der der stompclient sich beim MessageBroker aus dem Backend einschreibt.
 * 
 * @param callb ist die Callback Function, die nach erfolgreichem Connecten mit dem MessageBroker ausgefühht wird.
 *              'callb' wird von connectToUebersicht() zum Beispiel zum subscriben verwendet.
 * @param param ist ein Parameter, der an deie callb Function weitergereicht wird.
 *              Scheinbar muss die in callb mitgegebene Function aber keinen Parameter erwarten.
 *              Nicht gerade so, wie man es von typescript kennt. Klingt mehr nach javascript. aber gut...
 */
 async function connectChatToStomp(callb, param) {
    stompclient.onConnect = async (frame) => {
        console.log("Erfolgreich verbunden: " + frame);
        callb(param)
        console.log(callb.name + "()");
    };
    stompclient.activate();
}

/**
 * subscribeStompChat schreibt sich für die nötigen Topics für den Chat per stompclient ein.
 * 
 * @param lobby_id ist die Lobby ID, für die sich eingeschrieben werden soll.
 */
 function subscribeStompChat(lobby_id: string){
    chatSubscription = stompclient.subscribe(DEST_CHAT, (message) => {
        const chatmessage = JSON.parse(message.body) as ChatNachricht;
        empfangeChatNachricht(chatmessage);
    });
}

/**
 * Trennt die Verbindung der Chat-Subscription
 */
function unsubscribeChat(){
    chatSubscription.unsubscribe();
    aktLobbyID = "";
    DEST_CHAT = "";
}

/**
 * Sendet eine Chat-Nachricht vom Typ NachrichtenTyp an den Stompclient
 * @param typ NachtichtenTyp (JOIN, LEAVE, CHAT)
 * @param inhalt Textinhalt der Nachricht
 * @param sender Nutzer, von dem die Nachricht kommt
 */
async function sendeChatNachricht(typ: NachrichtenTyp, inhalt: string, sender: string) {
    const nachricht: ChatNachricht = { typ: typ, inhalt: inhalt, sender: sender };
    stompclient.publish({ destination: DEST_CHAT, body: JSON.stringify(nachricht) });
    console.log("Gesendete Nachricht: ", nachricht);
}

/**
 * Erstellt fuer jede erhaltene Nachricht ein Listenelement und fuegt es der Chat-Area an
 * Außerdem wird hier das Scrollverhalten des Chats umgesetzt
 * @param nachricht Empfangene Nachricht vom Typ ChatNachricht
 */
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
 * @returns Alle Chat Funktionen die nach außen erreichbar sein sollen
 */
 export function useChatStore() {
    return {
        // Chat Funktionen:
        sendeChatNachricht, empfangeChatNachricht, unsubscribeChat, subscribeChat
    }
}