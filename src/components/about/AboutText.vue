<template>
  <div>
    <h2>Über dieses Projekt</h2>
    <p>
      Im Rahmen des Moduls Softwaretechnik-Projekt im Wintersemester 2021/22
      wurde in einem Team bestehend aus 11 Personen ein Webgame entwickelt.
    </p>
    <p>
      Ziel des Softwaretechnik-Projekts ist einerseits die Entwicklung in einem
      realistischen Umfeld und unter verwendung von Scrum kennenzulernen, d.h.
      in kleinen Gruppen und verschiedenen Rollen komplexe Software zu
      entwickeln und neue Technologien kennenzulernen. Arbeiten werden dabei
      aufgeteilt, so dass asymmetrisch am Projekt gearbeitet werden kann und
      sich die Teammitglieder individuelle Schwerpunkte setzen können.
      Anderseits gilt es als Ziel Projektorganisation zu lernen.
    </p>
    <p>
      Dabei wurde Wert gelegt auf einen gleichmäßigen Projektfortschritt und
      planvolles und systematisches Vorgehen. Eine solide, erweiterbare und
      verständliche Architektur, die schrittweise weiterentwickelt wird und eine
      immer aktuelle Dokumentation darf natürlich auch nicht fehlen. Während der
      Entwicklung wurde auf gute Testabdeckung der Implementationen geachtet,
      sowie Fehler systematisch mit einem Ticketsystem erfasst und bearbeitet.
      Jedes Mitglied trägt eine aktiv Verantwortung für das Projekt.
    </p>

    <h2>Verwendete Technologien</h2>

    <div class="d-flex flex-wrap">
      <img src="@/assets/img/logos/Taiga.png" alt="" class="logo" />
      <h3 class="p-2 m-0">Projekt Management</h3>
    </div>
    <p>
      Zur Planung und Dokumentation unserer Arbeit verwendeten wir
      <a href="https://www.taiga.io/" class="link-success">Taiga</a>. TODO:
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
      amet.
    </p>

    <div class="d-flex flex-wrap">
      <img src="@/assets/img/logos/Vue.png" alt="" class="logo" />
      <h3 class="p-2 m-0">Frontend</h3>
    </div>
    <p>
      Für die Frontendentwicklung verwenden wir das JavaScript Framework
      <a href="https://vuejs.org/" class="link-success">Vue.js</a>. TODO: Lorem
      ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
      tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
      amet.
    </p>

    <div class="d-flex flex-wrap">
      <img src="@/assets/img/logos/Spring.png" alt="" class="logo" />
      <h3 class="p-2 m-0">Backend</h3>
    </div>
    <p>
      Für die Backendentwicklung verwenden wir das Java-Framework
      <a href="https://spring.io/projects/spring-boot" class="link-success"
        >Spring Boot</a
      >
      von Spring. TODO: Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
      sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
      erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
      rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
      dolor sit amet.
    </p>

    <h2>Projektziel</h2>
    <p>
      TODO: Was zu den vorraussetzungen wie Multiplayer, Modulare karten,
      Editor, Egoperspective und co.
    </p>

    <h2>Scrum</h2>
    <p>
      Scrum ist ein Vorgehensmodell des Projekt- und Produktmanagements,
      insbesondere zur agilen Softwareentwicklung. Es wurde ursprünglich in der
      Softwaretechnik entwickelt, ist aber davon unabhängig.
    </p>
    <p>
      Für die Verwendung von Scrum haben wir unser Team aufgeteilt in einen
      <b>Product Owner</b> und zehn <b>Developer</b>. Einer der Developer hat
      außerdem noch die Rolle des <b>Scrum Masters</b> übernommen. Da wir ja
      noch parallel alle andere Module belegt haben, haben wir unser "Daily
      Scrum" zwei mal wöchentlich abgehalten und unser gesamtes Projekt in vier
      Zwei-Wochen-Sprints aufgeteilt. Für das Planen und Koordinieren unserer
      Sprints verwendeten wir das Open-Source-Projektmanagementsystem
      <b>Taiga</b>.
    </p>
    <p>
      Ein Sprint begann bei uns immer mit dem <b>Sprint Planning</b> in dem wir
      uns zu erreichende Ziele für den Sprint setzten. In den darauf folgenden
      <b>Daylies</b>
      haben wir uns gegenseitig mitgeteilt, was wir erreicht haben und was wir
      weiterhin bis zum nächsten Treffen errreichen wollen.
      <br />
      Nach zwei Wochen neigt sich der Springt dann dem Ende und wir trafen uns
      zu unserem <b>Sprint Review</b>, in dem wir uns gegenseitig dann das
      Erreichte vorstellten und uns die Workitems im bessten Falle von dem
      Product Owner abnehmen lassen konnten. Zu guter letzt haben wir noch in
      der <b>Sprint Retrospective</b> besprochen, was gut und was schlecht lief
      und was wir im nächsten Sprint besser machen können.
    </p>
    <h2>Umsetzung</h2>
    <p>
      TODO: Vielleicht ein Paar Screenshots von Lobby, Editor und
      Spieleumgebung.
    </p>
    <h4>Lobby</h4>
    <div class="text-center">
      <img src="@/assets/img/screenshots/Screenshot_Lobby.png" alt="" class="img-fluid" />
    </div>
    <h4>Game</h4>
    <div class="text-center">
      <img src="@/assets/img/screenshots/Screenshot_Game.png" alt="" class="img-fluid" />
    </div>
    <h4>Editor</h4>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Teilnehmerliste",

  props: {},
  setup() {
    return {};
  },
});
</script>

<style>
.logo {
  height: 50px;
}
</style>
