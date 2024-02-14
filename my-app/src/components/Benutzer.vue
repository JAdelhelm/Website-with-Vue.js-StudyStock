<template>
  <div class="d-flex flex-column min-vh-100" v-if="userLoaded">
    <!--Navbar einbinden-->
    <Navbar />
    <div class="container" v-if="this.user">
      <!--Detailseite als Karte erstellen-->
      <div class="card">
        <!--Inhalt in den Body der Karte-->
        <div class="card-body">
          <!--Name des Angebots als Titel-->
          <h3 class="card-title">
            <u>{{ this.user.name }}</u>
          </h3>
          <!--Reihe innerhalb des Bodys erstellen-->
          <div class="row">
            <!--Spalte mit einer festen Größe erstellen-->
            <div class="col-lg-5 col-md-5 col-sm-6">
              <div class="white-box text-center">
                <!--Beim Bild Unterscheidung zwischen Prod und Development-->
                <div
                  class="child inline-block-child"
                  style="vertical-align: top"
                >
                  <!--Benutzerbild-->
                  <img
                    src="../assets/Portrait_Placeholder.png"
                    width="100%"
                    class="img-responsive"
                  />
                </div>
              </div>
            </div>
            <!--Zweite Spalte für Inhalte des Mediums-->
            <div class="col-lg-7 col-md-7 col-sm-6">
              <!--User, der Medium erstellt hat-->
              <h4 class="box-title">E-Mail: {{ user.email }}</h4>
              <!--Beschreibung des Benutzers-->
              <h4 class="box-title mt-4">User description:</h4>
              <p>
                {{ user.description }}
              </p>

              <!--Preis des Mediums-->
              <!--Weiterleitung zum Chat-->
              <router-link
                :to="{
                  path: '/chat',
                  query: {
                    offerUser: this.userid,
                  },
                }"
              >
                <!--Button, um zum Chat zu gelangen-->
                <button
                  style="
                    background-color: rgb(2, 143, 65);
                    color: white;
                    border: none;
                    cursor: pointer;
                  "
                  class="btn mt-auto btn-rounded"
                >
                  Contact
                </button>
              </router-link>
              <p></p>
              <!-- 
/**
 * Author: Jörg Adelhelm
 * Button, welcher die Funktion lockUser() aufruft,
 um den Benutzer durch den Admin zu sperren
 */
 -->
              <div>
                <button
                  @click="lockUser()"
                  v-if="this.role == 1"
                  type="submit"
                  class="btn btn-warning"
                >
                  Lock user
                </button>

                <!-- class divider um Space zwischen Buttons zu machen -->
                <div class="divider" />
                <button
                  @click="unlockUser() == false"
                  v-if="this.role == 1"
                  type="submit"
                  class="btn btn-primary"
                >
                  Unlock user
                </button>
                <p></p>
                <b v-if="msg">{{ msg }}</b>
              </div>
              <!--  
  
-->
              <div class="row">
                <div class="col-md-6">
                  <h4 class="box-title mt-4">Advertised Offers:</h4>
                  <div v-for="offer in offers" :key="offer.id">
                    <router-link
                      :to="{
                        path: '/offer',
                        query: {
                          id: offer.id,
                        },
                      }"
                    >
                      <ul class="list-group">
                        <li class="list-group-item">
                          {{ offer.name }}
                        </li>
                      </ul>
                    </router-link>
                  </div>
                </div>
                <div class="col-md-6">
                  <h4 class="box-title mt-4">Advertised Services:</h4>
                  <div v-for="service in services" :key="service.id">
                    <router-link
                      :to="{
                        path: '/service',
                        query: {
                          id: service.id,
                        },
                      }"
                    >
                      <ul class="list-group">
                        <li class="list-group-item">
                          {{ service.name }}
                        </li>
                      </ul>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center" style="margin-top: 20px">
            <div id="barchart2">
              <h4>Number of downloads of offers</h4>
              <BarChart2 :profileid="this.userid" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-else>
      <Content />
    </div>
    <!--Footer einbinden-->
    <Footer />
  </div>
</template>

<style scoped>
</style>

<script>
import Navbar from "./Navbar.vue";
import store from "../store.js";
import Footer from "./Footer.vue";
import { getBenutzer, getOfferHistory } from "../services/AngebotService.js";
import { getServiceHistory } from "../services/CreatorService.js";
import BarChart2 from "./BarChartBenutzer.vue";

import {
  lockUserService,
  unlockUserService,
} from "../services/SettingsService.js";

import Content from "./Content.vue";

export default {
  name: "Benutzer",
  components: {
    Navbar,
    Footer,
    Content,
    BarChart2,
  },
  data() {
    return {
      offers: [],
      services: [],
      userLoaded: "",
      prod: "",
      dev: "",
      userid: 0,
      user: "",
      role: 0,
      msg: "",
      download_status: "Download Chart",
    };
  },
  methods: {
    /**
     * Author: Jörg Adelhelm
     * Funktion, um Benutzer zu sperren
     * Rolle wird auf 3 gesetzt.
     * Sessiontoken wird gelöscht.
     */
    async lockUser() {
      const userSettings = {
        username: this.user.name,
      };
      this.msg = "User is locked!";

      const response = await lockUserService(userSettings);
      console.log(response);

      // store.dispatch("logout");
      // socket.disconnect();
      // this.$router.push("/login");
    },
    async unlockUser() {
      const userSettings = {
        username: this.user.name,
      };
      this.msg = "User is unlocked!";

      const response = await unlockUserService(userSettings);
      console.log(response);
      return true;
    },
  },
  mounted() {
    //Unterscheidung zwischen Prod und Dev
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }
    this.role = store.getters.getUser.rolle;
  },
  created() {
    //Prüfen, ob User eingeloggt ist
    if (!store.getters.isLoggedIn) {
      this.$router.push("/login");
    }

    this.username = store.getters.getUser.name;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const user_id = urlParams.get("id");
    this.userid = user_id;

    // Daten des Nutzers
    getBenutzer(user_id).then((response) => {
      this.user = response;
      this.userLoaded = "true";
      getServiceHistory(this.user.name).then((response) => {
        this.services = response;
        console.log(this.services);
      });
    });

    getOfferHistory(user_id).then((response) => {
      this.offers = response;
    });
  },
};
</script>
<style scoped>
.divider {
  width: 5px;
  height: auto;
  display: inline-block;
}
</style>

