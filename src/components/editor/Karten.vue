<template>
  <!-- Eingabe Kartenname und Kurzbeschreibung -->
  <div class="container" style="max-width: 600px">
    <div class="d-flex mt-5">
      <input
        v-model="karte"
        type="text"
        placeholder="Kartenname"
        class="form-control"
      />
      <input
        v-model="kbeschreibung"
        type="text"
        placeholder="Kurzbeschreibung"
        class="form-control"
      />
      <button @click="submitName" class="btn btn-warning rounded-0">OK</button>
    </div>

    <!-- Tabelle -->
    <table class="table table-bordered mt-5">
      <thead>
        <tr>
          <th scope="col">Kartenname</th>
          <th scope="col">Status</th>
          <th scope="col">Kurzbeschreibung</th>
          <th scope="col">Bearbeiten</th>
          <th scope="col">Löschen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(karte, index) in karten" :key="index">
          <td>{{ karte.name }}</td>
          <td style="width: 110px">
            <span
              @click="aendereStatus(index)"
              class="pointer"
              :class="{
                'text-danger': karte.status == 'in Arbeit',
                'text-success': karte.status == 'freigegeben',
              }"
            >{{ karte.status }}</span>
          </td>
          <td>{{ karte.beschreibung }}</td>
          <td>
            <div class="text-center" @click="bearbeiteName(index)">
              <span class="fa fa-pen"> </span>
            </div>
          </td>
          <td>
            <div class="text-center" @click="loescheName(index)">
              <span class="fa fa-trash"> </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Karten",
  data(){
    return{
      karte: '',
      bearbeiteterName: null,
      bearbeiteteBeschreibung: null,
      kbeschreibung: '',
      /* Spielstatus */
      statuse:['freigegeben','in Arbeit'],
      karten: [
        {
          name:'Schwerer Weg',
          status:'in Arbeit',
          beschreibung:'sehr schwer'
        },
        {
          name:'Easypeasy',
          status:'freigegeben',
          beschreibung:'einfaches Spiel'

        }
      ]
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
      this.karte='';
      this.kbeschreibung='';
    },
    /* Name und Beschreibung löschen */
    loescheName(index){
      this.karten.splice(index,1);
    },
    /* Name und Beschreibung ändern */
    bearbeiteName(index){
      this.karte=this.karten[index].name;
      this.kbeschreibung=this.karten[index].beschreibung;
      this.bearbeiteterName=index;
      this.bearbeiteteBeschreibung=index;

    },
    /* Status ändern */
    aendereStatus(index){
      let neuesI=this.statuse.indexOf(this.karten[index].status);
      if(++neuesI>1)neuesI=0;
      this.karten[index].status=this.statuse[neuesI];

    },
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
