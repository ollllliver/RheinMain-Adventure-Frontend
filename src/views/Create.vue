<template>
    <div>
      <h1> Create Lobby Page </h1>
      <button class="btn btn-primary" @click="$router.push('/')">
        Home
      </button>
      <InviteCopy/>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import InviteCopy from '@/components/InviteCopy.vue'

export default defineComponent({
  name: 'Create',
  components: { InviteCopy },
});

</script>

<style scoped>

</style>