<template>
  <div class="container" style="max-width: 600px">
    
    <!-- Eingabe Kartenname -->
    <div class="d-flex mt-5">
      <input
        type="text"
        v-model="task"
        placeholder="Kartename"
        class="w-100 form-control"
      />
      <button class="btn btn-warning rounded-0" @click="submitTask">
        OK
      </button>
    </div>



    <!-- Tabelle -->
    <table class="table table-bordered mt-5">
      <thead>
        <tr>
          <th scope="col">Kartenname</th>
          <th scope="col" style="width: 120px">Status</th>
          <th scope="col" style="width: 120px">Kurzbeschreibung</th>
          <th scope="col" class="text-center"><span>&#9998;</span></th>
          <th scope="col" class="text-center"><span>&#128465;</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td>
            <span>
              {{ task.name }}
            </span>
          </td>
          <td>
            <span
              class="pointer noselect"
              @click="changeStatus(index)"
              :class="{
                'text-danger': task.status === 'in Arbeit',
                'text-success': task.status === 'freigegeben',
              }"
            >
              {{ capitalizeFirstChar(task.status) }}
            </span>
          </td>
          <td class="text-center">
            <div @click="deleteTask(index)">
              <span class="fa fa-trash pointer"></span>
            </div>
          </td>
          <td class="text-center">
            <div @click="editTask(index)">
              <p class="fa fa-pen pointer"></p>
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
  props: {
    msg: String,
  },
  data() {
    return {
      task: "",
      editedTask: null,
      statuses: ["freigegeben", "in Arbeit"],
      /* Spielstatus */
      tasks: [
        {
          name: "Labyrinth",
          status: "freigegeben",
        },

      ],
    };
  },
  methods: {
    /* Großbuchstaben */
    capitalizeFirstChar(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    /* Status ändern*/
    changeStatus(index) {
      let newIndex = this.statuses.indexOf(this.tasks[index].status);
      if (++newIndex > 2) newIndex = 0;
      this.tasks[index].status = this.statuses[newIndex];
    },
    /* Löschen*/
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
    /* Bearbeiten */
    editTask(index) {
      this.task = this.tasks[index].name;
      this.editedTask = index;
    },
    /*Hinzufügen*/
    submitTask() {
      if (this.task.length === 0) return;
      /* Bearbeiten */
      if (this.editedTask != null) {
        this.tasks[this.editedTask].name = this.task;
        this.editedTask = null;
      } else {
        /* neue Aufgabe hinzufügen */
        this.tasks.push({
          name: this.task,
          status: "Status",
        });
      }
      this.task = "";
    },

  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.line-through {
  text-decoration: line-through;
}
</style>
