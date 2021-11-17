<template>
    <div>
      <h1> Join Lobby Page </h1>
      <button class="btn btn-primary" v-on:click="geklickt">
        Join Lobby
      </button>
      <button class="btn btn-primary" @click="$router.push('/')">
        Home
      </button>
    </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Client, Message } from '@stomp/stompjs';
  export default defineComponent({
    name: 'Join',
    setup() {
        // Absolute WS-URL zusammensetzen, Host/Port wie Frontend-Anw.
      const wsurl = `ws://${window.location.host}/gs-guide-websocket`;
      const DEST = "/topic/greetings";
      const stompclient = new Client({ brokerURL: wsurl })
      stompclient.onWebSocketError = (event) => { /* WS-Fehler */ }
      stompclient.onStompError = (frame) => { /* STOMP-Fehler */ }
      stompclient.onConnect = (frame) => {
        // Callback: erfolgreicher Verbindugsaufbau zu Broker
        console.log("Connected: " + frame);
        stompclient.subscribe(DEST, (message) => {
          // Callback: Nachricht auf DEST empfangen
          // empfangene Nutzdaten in message.body abrufbar,
          // ggf. mit JSON.parse(message.body) zu JS konvertieren
          console.log("message from broker:", message.body);

        });
      };
      stompclient.onDisconnect = () => { /* Verbindung abgebaut*/ }
        // Verbindung zum Broker aufbauen
/*      stompclient.activate();
        // Nachrichtenversand vom Client zum Server
      try {
        stompclient.publish({ destination: DEST, headers: {},
        body: JSON.stringify(datenobjekt)
        // ... oder body: "irgendein String"
      });
      } catch (fehler) {
        // Problem beim Senden
      }
*/
      return {
      }

    }
  });

</script>



<style scoped>

</style>