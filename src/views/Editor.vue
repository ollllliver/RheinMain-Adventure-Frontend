<!-- Editor View für den Level-Editor -->

<template>
    <div>
      <h1> Level Editor </h1>
      <button class="btn btn-primary" @click="$router.push('/')">
        Home
      </button>
      <div>
        <div>
        <button class="btn btn-primary" @click="doSomething">
          Addiere 1
        </button>
        <button class="btn btn-primary" @click="doSomethingElse">
          Multipliziere
        </button>
        </div>
        <button class="btn btn-primary" @click="undoSomething">
          Undo Command
        </button>
        <button class="btn btn-primary" @click="redoSomething">
          Redo Command
        </button>
      </div>
      <span class="title">Wand X-Koordinate: {{wand.x}}</span>

    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { CommandStack } from '@/commands/CommandManager';
import { ConcreteCommandTest, ConcreteMultiply } from '@/commands/Command';

export default defineComponent({
  name: 'Editor',

  //props: ['num'],
  data() {   
    return {
        wand: {x: 0} //Wand objekt zur Testzwecken
      }
  },
  
  methods: {
    doSomething(){ //Addiert 1 zur x-Koordinate
      CommandStack.getInstance().execAndPush(new ConcreteCommandTest(this.wand));
      console.log(CommandStack.getInstance().toString());
    },
    doSomethingElse(){ //Multipliziert x-Koordinate mit 10
      CommandStack.getInstance().execAndPush(new ConcreteMultiply(this.wand, 10));
      console.log(CommandStack.getInstance().toString());
    },
    undoSomething(){ //Macht rückgängig
      CommandStack.getInstance().undo();
    },
    redoSomething(){ //Wiederholt rückgängig gemachtes
      CommandStack.getInstance().redo();
    }
  },
});
</script>


<style scoped>

</style>