<!-- Home View mit Login/Regestrieren Formular -->

<template>
  <Login />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Login from '@/components/Login.vue'

export default defineComponent({
  name: 'Home',
  components: { Login },
  setup() {
    return {}
  }
});
</script>

<style scoped>

</style>