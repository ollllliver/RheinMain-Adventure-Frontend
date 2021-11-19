<template>
    <div>
      <h1> Create Lobby Page </h1>
      <button class="btn btn-primary" v-on:click="create">
        Create Lobby
      </button>
      <br>
      <br>
      <button class="btn btn-primary" @click="$router.push('/')">
        Home
      </button>
      <InviteCopy :link="link"/>
    </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Client, Message } from '@stomp/stompjs';
  import InviteCopy  from '@/components/InviteCopy.vue';
  
  export default defineComponent({
    name: 'Create',
    components: { InviteCopy },

       data: () => {
        return {
          baseURL: "localhost:",
          port: 8080,
        }
    },
    
    setup() {
      // Absolute WS-URL zusammensetzen, Host/Port wie Frontend-Anw.
      const wsurl = `ws://localhost:8080/messagebroker`;
      const stompclient = new Client({ brokerURL: wsurl })
      stompclient.onWebSocketError = (event) => { /* WS-Fehler */ }
      stompclient.onStompError = (frame) => { /* STOMP-Fehler */ }
      stompclient.onConnect = (frame) => {
        // Callback: erfolgreicher Verbindugsaufbau zu Broker
        console.log("Erfolgreich verbunden: " + frame);
        stompclient.subscribe("/topic/lobby/create", (message) => {
          // Callback: Nachricht auf DEST empfangen
          // empfangene Nutzdaten in message.body abrufbar,
          // ggf. mit JSON.parse(message.body) zu JS konvertieren
          console.log("message from broker:", message.body);

        });
      };
      stompclient.onDisconnect = () => { /* Verbindung abgebaut*/ }

      // Verbindung zum Broker aufbauen
      stompclient.activate();

      function create() {
        const DEST = "/topic/lobby/create";
        console.log("create")
        // Nachrichtenversand vom Client zum Server
        try {
          stompclient.publish({ destination: "/topic/lobby/create", headers: {},
          body: "Hier vielleicht der Username fuer das hashen der LobbyID"
          // ... oder body: "irgendein String"
        });
        } catch (fehler) {
          // Problem beim Senden
        }
      }

      return {
        create
      }

    },

    computed: {
      link() {
       return this.baseURL + this.port  + "/lobbyID" //TODO baseURL + port + LobbyID
      }
    },

    
  });
</script>

<style scoped>

</style>