<template>
  <div class="canvas">
    <Demo />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Demo from "@/components/inGame/Demo.vue";
export default defineComponent({
  name: "Environment",
  components: { Demo }
});
</script>

<style scoped>
</style>
