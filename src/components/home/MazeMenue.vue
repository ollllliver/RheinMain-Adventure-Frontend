<template>
  <div>
    <svg width="80%" viewBox="-10 -10 1020 620">
        <!-- Rahmen -->
        <polyline class="wand path" points="0,0 1000,0 1000,600 0,600 10,100"/>
        <!-- Mauern -->
        <polyline class="wand path" points="0,0 100,0 100,100 300,100 300,200 500,200 500,100"/>
        <polyline class="wand path" points="0,0 400,0 400,100"/>

        <!-- Wege -->
        <a id="a" href="/#/about" class="about">
            <text href="#" x="120" y="75" >Home</text>
        </a>
        <polyline id="b" class="wand" points="50,50 50,150 250,150 250,250 550,250 550,50 450,50 450,150 350,150 350,150 350,50 300,50"/>

    </svg>

  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MazeMenue",

  props: {},
  setup() {
    return {};
  },
});
</script>

<style>
.wand {
  fill:none;stroke:black;stroke-width:10;
}
.path {
  stroke-dasharray: 400%;
  stroke-dashoffset: 400%;
  animation: dash 1s linear forwards;
}
@keyframes dash {
  to {
    stroke-dashoffset: 10%;
  }
}

.about + polyline{
    display: none;
}

.about:hover + polyline{
  display: inline;
  stroke-dasharray: 400%;
  stroke-dashoffset: 400%;
  animation: dash 2s linear forwards;
}

text{
    font-size: 4em;
}
</style>
