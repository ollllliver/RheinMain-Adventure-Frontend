<template>
  <!-- Eingabe Kartenname und Kurzbeschreibung -->
  <div class="container" style="max-width: 600px">
    <div class="d-flex mt-5">
      <input
        v-model="levelname"
        type="text"
        placeholder="Levelname"
        class="form-control"
      />
      <input
        v-model="kbeschreibung"
        type="text"
        placeholder="Kurzbeschreibung"
        class="form-control"
      />
      <button @click="ladeKarte(-1)" class="btn btn-warning rounded-0" >neues Level hinzufuegen</button>
    </div>

    <!-- Tabelle -->
    <table class="table table-bordered mt-5" :key="karten">
      <thead>
        <tr>
          <th scope="col">Levelname</th>
          <th scope="col">Status</th>
          <th scope="col">Kurzbeschreibung</th>
          <th scope="col">Bearbeiten</th>
          <th scope="col">Löschen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="karte in karten" :key="karte">
          <td>{{karte.name}}</td>
          <td style="width: 110px">
            <span >{{karte.istFreigegeben ? "freigegeben" : "in Arbeit"}}</span>
          </td>
          <td>{{karte.beschreibung}}</td>
          <td>
            <div class="text-center" @click="ladeKarte(karte.levelId)" v-if="!karte.istFreigegeben">
              <span class="fa fa-pen" />
            </div>
            <div class="text-center" v-if="karte.istFreigegeben">
              <span class="fa fa-ban" />
            </div>

          </td>
          <td>
            <div class="text-center" @click="loescheKarte(karte)">
              <span class="fa fa-trash"> </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import userStore from "@/stores/user"
import editorStore from "@/stores/editor"
import { defineComponent, onMounted } from "vue";
import router from "@/router";
export default defineComponent({
  name: "Karten",
  data() {
    
    let karten = []
    

    // Wenn Komponente erstellt wird ueber aktuellen Nutzername Liste von erstellten Level abfragen
    // und in Array karten hinzufuegen
    onMounted( () => {
      fetch("/api/benutzer/level/"+userStore.getters.getBenutzername, {
        method: "GET",
      })
      .then(async res => {
        const listeVomBackend = await res.json()
        for (let i =0; i< listeVomBackend.length; i++) {
          this.karten.push(listeVomBackend[i])
        }
      })
      .catch((err => {
        console.log(err)
      }));
    })
    
    return {

      levelname: '',
      bearbeiteterName: null,
      bearbeiteteBeschreibung: null,
      kbeschreibung: '',
      karten,
    }
  },
  methods:{
    /* Name und Beschreibung hinzufügen */
    submitName() {
      if(this.karte.length==0) return;
      if(this.bearbeiteterName==null && this.bearbeiteteBeschreibung==null){
        this.karten.push({name: this.karte, status: 'in Arbeit', beschreibung: this.kbeschreibung,})
      } else {
        this.karten[this.bearbeiteterName].name=this.karte;
        this.karten[this.bearbeiteteBeschreibung].beschreibung=this.kbeschreibung;
        this.bearbeiteterName=null;
        this.bearbeiteteBeschreibung=null;
      }
      /* Leere Felder angezeigt bekommen */
      this.levelname='';
      this.kbeschreibung='';
    },
    /* Name und Beschreibung löschen */
    loescheKarte(karte){
      
      fetch("/api/level/"+karte.levelId, {
        method: "DELETE",
      })
      .then(() => {
        this.karten.splice(this.karten.indexOf(karte),1)
        
      })
      .catch((err => {
        console.log(err)
      }));
    },
    /* Name und Beschreibung ändern */
    bearbeiteName(index){
      this.karte=this.karten[index].name;
      this.kbeschreibung=this.karten[index].beschreibung;
      this.bearbeiteterName=index;
      this.bearbeiteteBeschreibung=index;
    },
    
    
    ladeKarte(levelId){
      fetch("/api/level/einfach/"+ userStore.getters.getBenutzername+"/"+levelId+"/0", {
        method: "GET",
      })
      .then(async res => {
        const erwartet = await res.json()
        if (erwartet.levelName === "") {
          erwartet.levelName = this.levelname
        }
        if (erwartet.levelBeschreibung === "") {
          erwartet.levelBeschreibung = this.kbeschreibung
        }
        editorStore.setzeLevel(erwartet)
        router.push("/editor")
      })
      .catch((err => {
        console.log(err)
      }));
    },

    /* Status ändern */
    aendereStatus(index){
      let neuesI=this.statuse.indexOf(this.karten[index].status);
      if(++neuesI>1)neuesI=0;
      this.karten[index].status=this.statuse[neuesI];
    },
  },

  
  
})

</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
