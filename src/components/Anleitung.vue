<template>
  <div>
    <center>
      <h3>Spielanleitung und Regeln</h3>
      <p>
        Spieler müssen in einem Level gemeinsam Schlüssel sammeln, um Türen zu
        öffnen. Erschwert wird das Ganze dadurch, dass ein Level aus einem
        Labyrinth besteht. In diesem Labyrinth sind die Wege durch Türen
        versperrt, zum öffnen müssen die im Labyrinth versteckten Schlüssel
        gefunden werden. Ein Level kann
        von 2 - 10 Personen gespielt werden. Nur wer einen Schlüssel besitzt,
        kann eine Tür öffnen und um ein Level zu bestehen, muss der Ente am Ziel
        eine Frage beantwortet werden.
      </p>
      <br>

      <table id="tabelle">
        <tr>
          <th>Steuerung</th>
          <th>Funktion</th>
        </tr>
        <tr>
          <td>WASD Tasten</td>
          <td>bewegen im Level</td>
        </tr>
        <tr>
          <td>Maus</td>
          <td>umgucken im Level</td>
        </tr>
        <tr>
          <td>E</td>
          <td>Interagieren mit Türen, Schlüsseln und Figuren</td>
        </tr>
        <tr>
          <td>ESC</td>
          <td>Spiel unterbrechen</td>
        </tr>
      </table>
    </center>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "tutorial",
  setup() {
    return {};
  },
});
</script>


<style scoped>
#tabelle {
  border-collapse: collapse;
  width: 100%;
}

#tabelle td,
#tabelle th {
  border: 1px solid #ddd;
  padding: 8px;
}

#tabelle th {
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: left;
  background-color: #6d9466;
  color: white;
}
</style>
