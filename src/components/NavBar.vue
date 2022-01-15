<template>
  <nav class="navbar navbar-light p-3 border-bottom border-success" style="background-color: #BDD3B9;">
    <a class="navbar-brand" href="#">
        <img src="/assets/RMA_Logo.png" height="40" class="d-inline-block align-top" alt="">
    </a>
    <!-- <div>
        {{navbar.title}}
    </div> -->
    <!-- <tr>
        <td class="btn" @click="router.push('/')">
            Home
        </td>
        <td class="btn" @click="router.push('/uebersicht')">
            Lobbyübersicht
        </td>
        <td class="btn" @click="router.push('/editor')">
            Editor
        </td>
        <td class="btn" @click="router.push('/environment')">
            Env
        </td>
        <td class="btn" @click="router.push('/instructions')">
            Anleitung
        </td>
    </tr> -->
    <button class="btn btn-success my-2 my-sm-0" type="submit">Logout</button>
  </nav>
</template>

<script>
import { defineComponent } from "vue";
import {navbar} from "@/stores/navbarStore"
import router from '@/router';
export default defineComponent({
  name: "NavBar",
  setup() {
    return {
        navbar,
        router,
    };
  },
});
</script>

<style>
</style>