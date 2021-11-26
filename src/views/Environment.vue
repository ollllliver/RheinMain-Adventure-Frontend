<template>
    <div>
      <h1> Render Demo </h1>
      <Demo />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Demo from '@/components/Demo.vue'
export default defineComponent({
  name: 'Environment',
  components: { Demo },

  //
  mounted() {
        window.addEventListener("keypress", e => {
          switch(e.key){
            case "w": console.log("Gehe nach vorne") 
              break;
            case "a": console.log("Gehe nach links")
              break;
            case "s": console.log("Gehe nach rechts")
              break;
            case "d": console.log("Gehe nach hinten")
              break;
            case "Enter": console.log(e.key + " gedrückt")
              break;
            case "q": console.log(e.key + " gedrückt")
              break;
            case "e": console.log(e.key + " gedrückt")
              break;
            case "Esc":
            case "Escape": console.log(e.key + " gedrückt")
              break;
            case " ": console.log(e.key + " gedrückt")
              break;
            default: console.log(e.key + " gedrückt (keinem Befehl zugewiesen)")
          }
        });
  }

});
</script>

 

<style scoped>

</style>