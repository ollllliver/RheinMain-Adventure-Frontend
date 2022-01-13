<template>
  <nav class="navbar navbar-light p-3 border-bottom border-success" style="background-color: #E0F6DD;">
    <a class="navbar-brand" href="#">
        <img src="favicon.ico" width="30" height="30" class="d-inline-block align-top" alt="">
        RheinMain-Adventure
    </a>
    <div>
        Aktuelle seite
    </div>
    <button class="btn btn-success my-2 my-sm-0" type="submit">Logout</button>
  </nav>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "NavBar",
  setup() {
    return {};
  },
});
</script>

<style>
</style>