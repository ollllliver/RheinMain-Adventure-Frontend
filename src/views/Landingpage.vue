<!-- View für die Landingpage -->

<template>

<div id="box" class="container my-5">
  <div class="row">
    <div class="col-md-7"> 
      <img src="../assets/img/rma_logo.png" class="float-left" width="600" height="265">
    </div>
    <div id="text" class="col-md-5">
      <p class="mt-4">
        Willkommen bei Rhein-Main-Adventure! 
        Du möchtest spannende Labyrinthe lösen? Und dabei viele Gegenstände sammeln?
        Dann bist du hier genau richtig!
        Melde dich jetzt bei uns an.
      </p>
      <button type="button" class="btn btn-light" @click="$router.push('/')">ANMELDEN</button>
    </div> 

    <div id="blackRow">&nbsp;</div>
  </div>

  
</div>

<div id="kasten" class="container my-5">
  <div class="row" >
  <div class="col" >
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <img class="card-img-top" src="../assets/img/rma_icon.png" alt="Card image cap">
        <h5 class="card-title">So funktioniert Rhein-Main Adventure</h5>
        <p class="card-text">Drücke auf Anleitung um genaueres über unser Spiel zu erfahren.</p>
        <button type="button" class="btn btn-secondary">Anleitung</button>
      </div>
    </div>
  </div>
  <div class="col ">
  </div>
  <div class="col">
    <div class="card" style="width: 18rem; ">
      <div class="card-body">
        <img class="card-img-top" src="../assets/img/rma_icon.png" alt="Card image cap">
        <h5 class="card-title">Starte jetzt dein persönliches Level</h5>
        <p class="card-text">Melde dich ein um direkt lozulegen. Viel Erfolg!</p>
        <button type="button" class="btn btn-secondary" @click="$router.push('/SignUp')">Einloggen</button>
      </div>
    </div>
  </div>
</div>
</div>

</template>

<script>
export default {
  
}
</script>


<style scoped>
#box{
  background-color: olivedrab ;
}
#text{
  color:white;
  text-align: center;
  
}
#blackRow {
margin: 0;
padding: 0;
height: 20px;
background-color: black;
}


#card-body{
  
  text-align: center;
  
}

#kasten{


display: flex;
justify-content: center;

}

</style> 