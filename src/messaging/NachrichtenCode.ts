export enum NachrichtenCode {
    // Benachrichtigung in der LobbyÜBERSICHT
    NEUE_LOBBY = "NEUE_LOBBY",
    LOBBY_ENTFERNT = "LOBBY_ENTFERNT",

    // Benachrichtigungen in der Lobby
    NEUER_MITSPIELER = "NEUER_MITSPIELER",
    MITSPIELER_VERLAESST = "MITSPIELER_VERLAESST",
    LOBBY_GESTARTET = "LOBBY_GESTARTET",
    COUNTDOWN_GESTARTET = "COUNTDOWN_GESTARTET",
    LOBBYZEIT_ABGELAUFEN = "LOBBYZEIT_ABGELAUFEN",
        
    // Lobby beitreten Antworten:
    ERFOLGREICH_BEIGETRETEN = "ERFOLGREICH_BEIGETRETEN",
    BEITRETEN_FEHLGESCHLAGEN = "BEITRETEN_FEHLGESCHLAGEN",
    SCHON_BEIGETRETEN = "SCHON_BEIGETRETEN",
    LOBBY_VOLL = "LOBBY_VOLL",
    KEINE_LOBBY_FREI = "KEINE_LOBBY_FREI",
    LOBBY_NICHT_GEFUNDEN = "LOBBY_NICHT_GEFUNDEN",
    BEREITS_IN_ANDERER_LOBBY = "BEREITS_IN_ANDERER_LOBBY",

    // Lobby Einstellungsänderungen Antworten:
    NEUE_EINSTELLUNGEN = "NEUE_EINSTELLUNGEN",
    KEINE_BERECHTIGUNG = "KEINE_BERECHTIGUNG"
}