import {NachrichtenTyp} from "@/messaging/NachrichtenTyp";

export interface ChatNachricht {
  typ: NachrichtenTyp;
  inhalt: string;
  sender: string;
}