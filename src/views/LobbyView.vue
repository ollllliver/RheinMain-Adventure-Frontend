<template>
  <div class="container">
    <Lobby :lobby_id="lobby_id"/>
  </div>
</template>

<script lang="ts">
import Lobby from "@/components/Lobby.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LobbyView",
  components: {Lobby},
  props: {
    lobby_id: { type: String, reqired: true },
  }
});
</script>


<style scoped>
</style>