<!-- Editor View für den Level-Editor -->

<template>
    <div>
      <h1> Level Editor </h1>
      <button class="btn btn-primary" @click="$router.push('/')">
        Home
      </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Editor'
});
</script>


<style scoped>

</style>