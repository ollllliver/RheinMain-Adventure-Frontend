<template>
  <div class="center">
    <Signup/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Signup from '@/components/Signup.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Signup
  },
});
</script>