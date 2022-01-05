<template>
  <div>
    <h1>Render Demo</h1>
    <Demo />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Demo from "@/components/Demo.vue";
export default defineComponent({
  name: "Environment",
  components: { Demo }
});
</script>

<style scoped>
</style>
