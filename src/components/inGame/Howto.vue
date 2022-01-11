<template>
    
    <div >
        <center>
            <h3> Tutorial </h3>
                <table border="2"  bordercolordark="#800000" 
                bordercolorlight="#FF0000">
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
td {
    border:2px solid black;
}
</style>