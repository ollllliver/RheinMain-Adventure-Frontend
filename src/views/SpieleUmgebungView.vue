<template>
  <div class="canvas">
    <Spieleumgebung />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Spieleumgebung from "@/components/inGame/Spieleumgebung.vue";
export default defineComponent({
  name: "Environment",
  components: { Spieleumgebung }
});
</script>

<style scoped>
</style>
