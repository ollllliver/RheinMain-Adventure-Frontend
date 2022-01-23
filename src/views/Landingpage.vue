<!-- View für die Landingpage -->

<template>
<div id="box" class="container my-5">
  <div class="row">
    <div id="mitte" class="col-md-7"> 
      <h1>Willkommen bei<br /><span>Rhein-Main Adventure!</span></h1>
        <p align="left" class="text">Du liebst Labyrinthe bauen und knackst sie am liebsten mit anderen? 
        Dann bist du hier genau richtig!</p>
          <button type="button" class=" btn-lg btn-block rounded-0" id="button" @click="$router.push('/login')">Jetzt Anmelden</button>
    </div>
    <div class="col-md-5">
      <img src="../assets/img/logos/RMA_heart.png" class="float-left" width="400" height="400">
     </div> 
  </div>
</div>

</template>
<script>
export default {
}
</script>


<style scoped>
#button{
  background-color: #6d9466;
  color: black;
  text-decoration: none;
  padding: 10px 60px;
  font-size: 30px;
  border: 2px solid black;
  cursor: pointer;
  margin: 30px;
}
#mitte{
  color:black;
  text-align: center; 
}

p.text {
  margin: 35px;
  font-size: 18px;
  }
</style> 