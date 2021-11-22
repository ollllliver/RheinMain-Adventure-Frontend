<template>
    <div>
      <h1> Join Lobby Page </h1>
      <input v-model="linkInput" placeholder="Einladungs Link bitte einfügen.">
      <p>Message is: {{ linkInput }}</p>
      <br>
      <button class="btn btn-primary" v-on:click="join">
        Join Lobby
      </button>
      <br>
      <br>
      <button class="btn btn-primary" @click="$router.push('/')">
        Home
      </button>
    </div>
</template>

<script lang="ts">
  import { defineComponent,ref } from 'vue';
  import { Client, Message } from '@stomp/stompjs';


  export default defineComponent({
    name: 'Join',
    setup() {
      // Absolute WS-URL zusammensetzen, Host/Port wie Frontend-Anw.
      const wsurl = `ws://localhost:8080/messagebroker`;
      const stompclient = new Client({ brokerURL: wsurl })
      stompclient.onWebSocketError = (event) => { /* WS-Fehler */ }
      stompclient.onStompError = (frame) => { /* STOMP-Fehler */ }
      stompclient.onConnect = (frame) => {
        // Callback: erfolgreicher Verbindugsaufbau zu Broker
        console.log("Erfolgreich verbunden: " + frame);
      };
      stompclient.onDisconnect = () => { /* Verbindung abgebaut*/ }

      // Verbindung zum Broker aufbauen
      stompclient.activate();

      const linkInput = ref("");

      function join() {
        console.log("/topic/lobby/"+linkInput.value);
        stompclient.subscribe("/topic/lobby/"+linkInput.value, (message) => {
        // Callback: Nachricht auf DEST empfangen
        // empfangene Nutzdaten in message.body abrufbar,
        // ggf. mit JSON.parse(message.body) zu JS konvertieren
        console.log("ANTWORT BROKER:", message.body);
        });
      }

      return {
        join,linkInput
      }

    }
  });

</script>



<style scoped>

</style>