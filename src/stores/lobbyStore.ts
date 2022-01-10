import { Lobby } from "@/models/Lobby"
import { Spieler } from "@/models/Spieler"
import { reactive } from "vue"

/**
 * lobbystate ist ein reactive, das zu einer Lobby essentielle Infos hält + errormessage
 */
export const lobbystate = reactive({
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
    countdown: 10,
})

/**
 * alleLobbiesState ist ein reactive, das die Liste von Lobbys hält + errormessage
 */
export const alleLobbiesState = reactive({
    lobbies: Array<Lobby>(),
    errormessage: ""
})
