<template>
  <!-- Eingabe Kartenname und Kurzbeschreibung -->
  <div class="container" style="max-width: 600px">
    <div class="d-flex mt-5">
      <input
          id="leVelname"
          v-model="levelname"
          class="form-control"
          placeholder="Levelname"
          type="text"
      />
      <input
          id="kbeschreibung"
          v-model="kbeschreibung"
          class="form-control"
          placeholder="Kurzbeschreibung"
          type="text"
      />
      <button id="hinzufuegen" class="btn btn-success rounded-8" @click="ladeKarte(-1)">neues Level hinzufuegen</button>
    </div>

    <!-- Tabelle -->
    <table :key="karten" class="table table-bordered mt-5">
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
        <td>{{ karte.name }}</td>
        <td style="width: 110px">
          <span>{{ karte.istFreigegeben ? "freigegeben" : "in Arbeit" }}</span>
        </td>
        <td>{{ karte.beschreibung }}</td>
        <td>
          <div v-if="!karte.istFreigegeben" class="text-center" @click="ladeKarte(karte.levelId)">
            <span class="fa fa-pen"/>
          </div>
          <div v-if="karte.istFreigegeben" class="text-center">
            <span class="fa fa-ban"/>
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
import {defineComponent, onMounted} from "vue";
import router from "@/router";

export default defineComponent({
  name: "Karten",
  data() {

    let karten = []
    /**
     * Wenn Komponente erstellt wird ueber aktuellen Nutzername Liste von erstellten Level abfragen
     *  und in Array karten hinzufuegen
     */
    onMounted(() => {
      fetch("/api/benutzer/level/" + userStore.getters.getBenutzername, {
        method: "GET",
      })
          .then(async res => {
            const listeVomBackend = await res.json()
            for (let i = 0; i < listeVomBackend.length; i++) {
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
  methods: {
    /* Name und Beschreibung hinzufügen */
    submitName() {
      if (this.karte.length == 0) return;
      if (this.bearbeiteterName == null && this.bearbeiteteBeschreibung == null) {
        this.karten.push({name: this.karte, status: 'in Arbeit', beschreibung: this.kbeschreibung,})
      } else {
        this.karten[this.bearbeiteterName].name = this.karte;
        this.karten[this.bearbeiteteBeschreibung].beschreibung = this.kbeschreibung;
        this.bearbeiteterName = null;
        this.bearbeiteteBeschreibung = null;
      }
      /* Leere Felder angezeigt bekommen */
      this.levelname = '';
      this.kbeschreibung = '';
    },
    /**
     * loescht karte mit uergebener id aus dem Backend
     * und entfernt Sie in der Liste
     */

    loescheKarte(karte) {

      fetch("/api/level/" + karte.levelId, {
        method: "DELETE",
      })
          .then(() => {
            this.karten.splice(this.karten.indexOf(karte), 1)

          })
          .catch((err => {
            console.log(err)
          }));
    },
    /* Name und Beschreibung ändern */
    bearbeiteName(index) {
      this.karte = this.karten[index].name;
      this.kbeschreibung = this.karten[index].beschreibung;
      this.bearbeiteterName = index;
      this.bearbeiteteBeschreibung = index;
    },

    /**
     * laedt karte von uebergebenen Nutzer mit uebergebener id aus dem Backend
     und setzt das Ergebnis in den editorStore
     */
    ladeKarte(levelId) {
      fetch("/api/level/einfach/" + userStore.getters.getBenutzername + "/" + levelId + "/0", {
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
  },
})

</script>

<style scoped>
.pointer {
  cursor: pointer;
}

#kbeschreibung {
  margin: 5px;
}

#leVelname {
  margin: 5px;
}

#hinzufuegen {
  margin: 5px;
}

</style>
