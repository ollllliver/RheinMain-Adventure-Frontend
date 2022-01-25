<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h2>Lobbyauswahl</h2>
      </div>
      <div class="col d-flex justify-content-end">
        <button class="btn btn-success" @click="refresh">refresh</button>
      </div>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th scope="col">Karte</th>
        <th scope="col">Host</th>
        <th scope="col">Teilnehmer</th>
        <th scope="col">Beitreten</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="lobby in alleLobbiesState.lobbies.filter(lobby => !lobby.istPrivat)" :key="lobby.lobbyID"
          :lobby="lobby">
        <th>{{ lobby.gewaehlteKarte.name }}</th>
        <th>{{ lobby.host.name }}</th>
        <th>{{ lobby.teilnehmerliste.length }}/{{ lobby.spielerlimit }}</th>
        <td class="list-group-item list-group-item-action">
          <button class="btn btn-success w-100 m-0" v-on:click="redirectToLobby(lobby.lobbyID)">beitreten</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>


<script lang="ts">
import {defineComponent} from "vue";
import {useLobbyStore} from "@/services/lobby/lobbyService";
import router from "@/router";

export default defineComponent({
  name: "Lobbyliste",

  props: {},
  setup() {
    const {alleLobbiesState, connectToLobby, alleLobbiesladen} = useLobbyStore();

    function refresh() {
      alleLobbiesladen();
    }

    function redirectToLobby(id: string) {
      router.push("/lobby/" + id);
    }

    return {
      alleLobbiesState, connectToLobby, refresh, redirectToLobby,
    };
  },
});
</script>
