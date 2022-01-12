import { Client, StompSubscription } from '@stomp/stompjs';
import {NachrichtenTyp} from '@/messaging/NachrichtenTyp';
import {ChatNachricht} from '@/messaging/ChatNachricht';

const wsurl = `ws://localhost:8080/messagebroker`;
const stompclient = new Client({brokerURL: wsurl});

// verwendete StompSubscription
let lobbyChatSubscription: StompSubscription;

let aktLobbyID = "";
let DEST_CHAT = "";

export enum ChatTyp {
    LOBBY,
    INGAME
}

function subscribeChat(lobby_id: string, typ: ChatTyp){
    aktLobbyID = lobby_id;

    switch (typ) {
        case ChatTyp.LOBBY:
            DEST_CHAT = "/topic/lobby/" + lobby_id + "/chat";
            break;
        case ChatTyp.INGAME:
            DEST_CHAT = "/topic/environment/" + lobby_id;
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
    lobbyChatSubscription = stompclient.subscribe(DEST_CHAT, (message) => {
        const chatmessage = JSON.parse(message.body) as ChatNachricht;
        empfangeChatNachricht(chatmessage);
    });
}

function unsubscribeChat(){
    lobbyChatSubscription.unsubscribe();
    aktLobbyID = "";
    DEST_CHAT = "";
}

async function sendeChatNachricht(typ: NachrichtenTyp, inhalt: string, sender: string) {
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

 export function useChatStore() {
    return {
        // Chat Funktionen:
        sendeChatNachricht, empfangeChatNachricht, unsubscribeChat, subscribeChat
    }
}