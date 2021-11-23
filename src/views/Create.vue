<!-- Create View um Lobbys zu erstellen -->

<template>
    <div>
      <h1> Create Lobby Page </h1>
      <button class="btn btn-primary" @click="$router.push('/')">
        Home
      </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  name: 'Create',
});
</script>

<style scoped>

</style>