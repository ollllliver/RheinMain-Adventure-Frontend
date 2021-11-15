<template>
    <div>
      <h1> Join Lobby Page </h1>
      <button class="btn btn-primary" @click="$router.push('/')">
        Home
      </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Join',
});
</script>


<style scoped>

</style>