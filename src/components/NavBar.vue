<template>
  <div class="p-2 border-bottom border-success d-flex align-items-center justify-content-between" style="background-color: #BDD3B9;">
    <router-link class="mr-auto" to="/home" >
    <img src="/assets/RMA_Logo.png" height="40" alt="">
    </router-link>
    <div>
      <div v-if="userStore.state.istEingeloggt" class="btn-success dropdown">
        <button class="dropbtn" v-text="userStore.state.benutzername"></button>
        <div class="dropdown-content">
          <button class="red-btn w-100" @click="userStore.logout()">Logout</button>
        </div>
      </div>
      <router-link v-else class="dropbtn" to="/home">Login</router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {navbar} from "@/stores/navbarStore"
import router from '@/router';
import userStore from '@/stores/user'

export default defineComponent({
  name: "NavBar",
  setup() {
    return {
        navbar,
        router,
        userStore,
    };
  },
});
</script>

<style>
.dropbtn {
  background-color: #6d9466;
  color: white;
  text-decoration: none;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #c0dcbd;
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: -2px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.green-btn:hover {background-color: #1e7900;}
.red-btn:hover {background-color: #840000;}
.grey-btn:hover {background-color: #aacca4;}
.dropdown:hover .dropdown-content {display: block;}
.dropbtn:hover{
  background-color: #4f7a46;
  color: white;
  text-decoration: none;
  }

.red-btn {
  background-color: #aa0404;
  color: white;
  padding: 10px;
  border: 2px solid #980000;
  cursor: pointer;
}

.green-btn {
  background-color: #2aa900;
  color: white;
  padding: 10px;
  border: 2px solid #28a000;
  cursor: pointer;
}

.grey-btn {
  background-color: #d4e6d2;
  color: black;
  padding: 10px;
  border: 2px solid #c0dcbd;
  cursor: pointer;
}

</style>