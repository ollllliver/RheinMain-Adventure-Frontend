import {NachrichtenCode} from "@/messaging/NachrichtenCode";

export interface LobbyMessage {
  typ: NachrichtenCode;
  istFehler: boolean;
  payload: string;
}