<template>
  <Navbar/>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from "@/components/NavBar.vue"
export default defineComponent({
  components: {Navbar},
  name: 'App'
})
</script>