<template>
    
    <div >
        <center>
            <h3> Anleitung  </h3>
                <table id= "tabelle">
                <tr>
                    <th>Steuerung</th>
                    <th>Funktion</th>
                </tr>
                <tr>
                    <td>WASD oder Pfeiltaste</td>
                    <td>Bewegung</td>
                </tr>
                <tr>
                    <td>Q </td>
                    <td>90 Grad nach links Drehung</td>
                </tr>
                <tr>
                    <td>E </td>
                    <td>90 Grad nach rechts Drehung</td>
                </tr>
                <tr>
                    <td>F oder Leerzeichen </td>
                    <td>Interaktion mit Dingen</td>
                </tr>
                </table> 

                
       </center>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'tutorial',
});
</script>


<style scoped>


#tabelle {

  border-collapse: collapse;
  width: 100%;
}

#tabelle td, #tabelle th {
  border: 1px solid #ddd;
  padding: 8px;
}


#tabelle th {
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: left;
  background-color: #6d9466 ;
  color: white;
}


</style>