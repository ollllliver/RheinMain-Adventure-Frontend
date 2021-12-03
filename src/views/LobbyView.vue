<template>
  <div class="container" v-if="darfBeitreten" >
    <h1>Lobby {{ lobbystate.lobbyID }}</h1>
    <ul>
      <h3>istVoll: {{ lobbystate.istVoll }}</h3>
      <h3>spielerlimit: {{ lobbystate.spielerlimit }}</h3>
      <h3>istGestartet: {{lobbystate.istGestartet}}</h3>
      <h3>host: {{lobbystate.host}}</h3>
    </ul>
    <div class="container">
      <div :teilnehmer="teilnehmer" v-for="teilnehmer in teilnehemrliste" :key="teilnehmer.id">
      <li>{{ teilnehmer.name }}</li>
      </div>
    </div>
    <InviteCopy :link="link" />
    <Chat :sendeNachricht="sendeChatNachricht" />
    <button class="btn btn-primary" v-on:click="joinWalter">als Walter joinen</button>
    <button class="btn btn-primary" v-on:click="joinMarie">als Marie joinen</button>
    <button class="btn btn-primary" v-on:click="joinPlayer1">als jemand, der schon in der Lobby ist, die Seite aufren</button>
    <button class="btn btn-primary" v-on:click="verlassen">LEAVE LOBBY</button>
    <button class="btn btn-primary" v-on:click="starten">SPIEL STARTEN</button>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useLobbyStore } from "@/services/LobbyStore";
import { Benutzer } from "@/services/Benutzer";
import InviteCopy  from '@/components/InviteCopy.vue';
import Chat  from '@/components/Chat.vue';

export default defineComponent({
  name: "Lobby",
  components: {InviteCopy, Chat},
  props: {
    lobby_id: { type: String, reqired: true },
  },
  setup(props) {
    const { lobbystate, connectToLobby, updateLobby, joinLobby, leaveLobby, sendeChatNachricht, empfangeChatNachricht,starteLobby } = useLobbyStore();
    const linkInput = ref("");
    
    const darfBeitreten = computed(() =>{
      return lobbystate.darfBeitreten;
    });

    onMounted(async() =>{
      connectToLobby(String(props.lobby_id));
    })

    const angezeigteteilnehmer = computed(() => {
      return lobbystate.teilnehmerliste;
    });

    const link = computed(() => {
      return "http://localhost:3000/lobby/" + props.lobby_id; //TODO baseURL + port + LobbyID
    });


    function joinWalter(){
      join("Walter");
    }
    function joinMarie(){
      join("Marie")
    }
    function joinPlayer1(){
      join("Player1")
    }

    function starten(){
      starteLobby().then(response => {
        //TODO : HIER ANSICHT WECHSELN UND VISUELLEN 10 SEKUNDEN TIMER STARTEN
        console.log(response);
      }).catch(err =>{
        console.log(err);
      });
    }

    async function join(username:string) {
      // Das join sollte eigendlich bei onMount aufgerufen werden, Testweise aber manuell über Buttons
      console.log("/topic/lobby/"+props.lobby_id +" - " + username);
      const b: Benutzer = {id:5,name:username};
      joinLobby({id:5,name:username})
      // jetzt irgendwie schauen, ob username schon in der Liste drinnen ist.
      
    }

    async function verlassen(username:string){
      console.log("/topic/lobby/"+props.lobby_id +" - " + username);
      leaveLobby(username)
    }

    return {
      teilnehemrliste: angezeigteteilnehmer,
      lobbystate, link,
      joinWalter, joinMarie, joinPlayer1,
      darfBeitreten,
      sendeChatNachricht, empfangeChatNachricht,
      verlassen,starten
    };
  },
});
</script>


<style scoped>
</style>