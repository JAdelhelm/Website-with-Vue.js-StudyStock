
<template>
  <div>
    <AutoLogout />
    <!--Navbar erstellen-->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <!--Logo innerhalb der Navbar erstellen, mit dem man auf Startseite gelangt-->
      <a class="navbar-brand" href="/">
        <img src="../assets/studystock.png" class="img-responsive" />
      </a>
      <!--Responsive, Button für Navbar erstellen, wenn Bildschirm kleiner wird-->
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbar5"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="navbar-collapse collapse"
        id="navbar5"
        style="align-self: center"
      >
        <!--Suchleiste innerhalb der Navbar erstellen-->
        <form class="mx-2 my-auto d-inline w-100 m-10 p-222">
          <div class="input-group" style="margin-bottom: 5px">
            <!--Input-Feld zur Suche, funktioniert auch durch "pressEnter" und nur bei Buchstaben-->
            <input
              id="myInput"
              type="text"
              style="height: 50px"
              class="form-control border border-right-0"
              placeholder="Search..."
              maxlength="40"
              v-model="query"
              @click="pressEnter"
              v-on:keypress="isLetter($event)"
            />
          </div>
        </form>
        <ul class="navbar-nav">
          <!--Suchbutton erstellen-->
          <div class="nav-item" style="align-self: center">
            <!--Nach Klick wird der Inhalt innerhalb einer Query zur "Suchseite" weitergeleitet, steht in url-->
            <router-link
              :to="{
                path: '/search',
                query: {
                  query: this.query,
                  sortBy: this.sortBy,
                  price: this.price,
                  type: this.type,
                },
              }"
            >
              <!--Bei Ausführung des Such-Buttons  ausgeführt-->
              <button
                id="myBtn"
                style="height: 50px"
                class="btn btn-outline-success my-2 my-sm-0"
                type="button"
              >
                Search
              </button>
            </router-link>
          </div>
          <!--Upload-Button erstellen-->
          <div class="nav-item" style="align-self: center">
            <li class="text-center">
              <!--Nach Klick wird der Benutzer zur Upload-Seite weitergeleitet-->
              <router-link to="/upload">
                <a
                  ><img src="https://img.icons8.com/material/80/000000/add.png"
                /></a>
              </router-link>
            </li>
          </div>
          <!--Unterscheidung beim Dropdown-Menü zwischen Admin und normalem User-->
          <!--Erstellen des Dropdown-Menüs für normale User-->
          <div
            v-if="admin === '0'"
            class="nav-item"
            style="align-self: center; margin-top: 22px"
          >
            <!--Benutzer-Logo als Dropdown-Objekt-->
            <a
              style="text-align: center"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                src="https://img.icons8.com/color/64/000000/test-account.png"
              />
              <div>{{ username }}</div>
              <!--Notification von Chat anzeigen, wenn ungelesene Nachricht angekommen ist-->
              <div id="noti-count" v-if="this.notificationCount > 0">
                <div>{{ this.notificationCount }}</div>
              </div>
            </a>
            <!--Erstellen des Dropdown-Menüs-->
            <div
              class="dropdown-menu dropdown-menu-right nav-user-dropdown"
              aria-labelledby="dropdownMenuButton"
            >
              <div class="nav-user-info" style="text-align: left">
                <!--Benutzer wird zum Profil weitergeleitet-->
                <router-link :to="{ path: '/profile' }">
                  <a class="dropdown-item">
                    <i class="fas fa-user mr-2"></i>
                    Profile
                  </a>
                </router-link>
                <!--Benutzer wird zu seinen Uploads weitergeleitet-->
                <router-link :to="{ path: '/uploads' }">
                  <a class="dropdown-item"
                    ><i class="fas fa-upload mr-2"></i>My Uploads</a
                  ></router-link
                >
                <!--Benutzer wird zu seinen aktiven Angeboten weitergeleitet-->
                <router-link :to="{ path: '/offers' }">
                  <a class="dropdown-item"
                    ><i class="far fa-envelope-open mr-2"></i>My Offers</a
                  ></router-link
                >
                <!--Benutzer wird zu seinen aktiven Services weitergeleitet-->
                <router-link :to="{ path: '/services' }">
                  <a class="dropdown-item"
                    ><i class="fas fa-tasks mr-2"></i>My Services</a
                  ></router-link
                >
                <!--Benutzer wird zu Anfragen für seine Medien weitergeleitet-->
                <router-link :to="{ path: '/requests' }">
                  <a class="dropdown-item"
                    ><i class="far fa-envelope mr-2"></i>My Requests
                    <span class="dot" v-if="this.requests">{{
                      this.requests
                    }}</span></a
                  >
                </router-link>
                <!--Benutzer wird zu seinen Downloads weitergeleitet-->
                <router-link :to="{ path: '/downloads' }">
                  <a class="dropdown-item"
                    ><i class="fas fa-download mr-2"></i>My Downloads</a
                  >
                </router-link>
                <!--Benutzer wird zum Chat weitergeleitet-->
                <router-link :to="{ path: '/chat' }">
                  <a class="dropdown-item"
                    ><i class="fas fa-comment mr-2"></i>My Chat
                    <span class="dot" v-if="this.unreadMessages">{{
                      this.unreadMessages
                    }}</span></a
                  >
                </router-link>

                <!--Benutzer kann sich über einen Button ausloggen-->
                <div class="nav-user-info">
                  <button
                    class="dropdown-item"
                    for
                    value="Logout"
                    @click="logout"
                    type="button"
                  >
                    <i class="fas fa-power-off mr-2"></i>Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!--Dropdown-Menü für den Admin-->
          <div
            v-if="admin === '1'"
            class="nav-item"
            style="align-self: center; margin-top: 22px"
          >
            <!--Benutzer-Logo als Dropdown-Objekt-->
            <a
              style="text-align: center"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                src="https://img.icons8.com/color/64/000000/test-account.png"
              />
              <div>{{ username }}</div>
              <!--Notification von Chat anzeigen, wenn ungelesene Nachricht angekommen ist-->
              <div id="noti-count" v-if="this.notificationCount > 0">
                <div>{{ this.notificationCount }}</div>
              </div>
            </a>
            <!--Erstellen des Dropdown-Menüs für den Admin-->
            <div
              class="dropdown-menu dropdown-menu-right nav-user-dropdown"
              aria-labelledby="dropdownMenuButton"
            >
              <!--Admin wird zum Profil weitergeleitet-->
              <div class="nav-user-info" style="text-align: left">
                <router-link :to="{ path: '/profile' }">
                  <a class="dropdown-item">
                    <i class="fas fa-user mr-2"></i>
                    Profile
                  </a>
                </router-link>
                <!--Zusätzlich zum normalen Benutzer kann der Admin einkommende Angebote akzeptieren/ablehnen-->
                <router-link :to="{ path: '/admin' }">
                  <a class="dropdown-item"
                    ><i class="fas fa-database mr-2"></i>Incoming Offers
                    <span class="dot" v-if="this.pendingOffers">{{
                      this.pendingOffers
                    }}</span></a
                  ></router-link
                >
                <!--Admin wird zu seinen Uploads weitergeleitet-->
                <router-link :to="{ path: '/uploads' }">
                  <a class="dropdown-item"
                    ><i class="fas fa-upload mr-2"></i>My Uploads</a
                  ></router-link
                >
                <!--Admin wird zu seinen aktiven Angeboten weitergeleitet-->
                <router-link :to="{ path: '/offers' }">
                  <a class="dropdown-item"
                    ><i class="far fa-envelope-open mr-2"></i>My Offers</a
                  ></router-link
                >
                <!--Admin wird zu seinen aktiven Services weitergeleitet-->
                <router-link :to="{ path: '/services' }">
                  <a class="dropdown-item"
                    ><i class="fas fa-tasks mr-2"></i>My Services</a
                  ></router-link
                >
                <!--Admin wird zu Anfragen für seine Medien weitergeleitet-->
                <router-link :to="{ path: '/requests' }">
                  <a class="dropdown-item"
                    ><i class="far fa-envelope mr-2"></i>My Requests
                    <span class="dot" v-if="this.requests">{{
                      this.requests
                    }}</span></a
                  >
                </router-link>
                <!--Admin wird zu seinen Downloads weitergeleitet-->
                <router-link :to="{ path: '/downloads' }">
                  <a class="dropdown-item"
                    ><i class="fas fa-download mr-2"></i>My Downloads</a
                  >
                </router-link>
                <!--Admin wird zum Chat weitergeleitet-->
                <router-link :to="{ path: '/chat' }">
                  <a class="dropdown-item"
                    ><i class="fas fa-comment mr-2"> </i>My Chat
                    <span class="dot" v-if="this.unreadMessages">{{
                      this.unreadMessages
                    }}</span></a
                  >
                </router-link>
                <!--Admin kann sich über einen Button ausloggen-->
                <button
                  class="dropdown-item"
                  for
                  value="Logout"
                  @click="logout"
                  type="button"
                >
                  <i class="fas fa-power-off mr-2"></i>Logout
                </button>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/*Navbar wird links und rechts etwas eingerückt */
nav {
  padding-left: 20px !important;
  padding-right: 20px !important;
}

/*Bild innerhalb der Navbar wird links eingerückt und erhält eine feste Höhe */
.navbar-brand img {
  height: 50px;
  float: left;
}

/*Unterschied zwischen unterpunkten und oben */
.dot {
  height: 20px;
  width: 20px;
  background-color: rgb(214, 54, 54);
  color: #fff;
  border-radius: 50%;
  display: inline-block;
  font-size: 13px;
  text-align: center;
  font-family: Helvetica;
}

#noti-count {
  position: absolute;
  top: 20px;
  right: 10px;
  background-color: rgb(214, 54, 54);
  color: #fff;
  padding: 5px;
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  border-radius: 30px;
  width: 30px;
  height: 30px;
  text-align: center;
  font-family: Helvetica;
}
</style>

<script>
//Import von notwendigen Methoden
import { getPendingOffers } from "../services/AngebotService";
import store from "../store.js";
import socket from "../socket";
import { getUnreadMessages } from "../services/MessageService";
import { getRequests } from "../services/RequestService";
import AutoLogout from "./AutoLogout.vue";

export default {
  name: "Navbar",
  components: {
    AutoLogout,
  },
  data: function () {
    //Alle 10 Sekunden überprüfen ob es neue Notifications gibt
    setInterval(this.getNotifications, 10000);

    return {
      query: "",
      images: [],
      upload: null,
      kategorie: "",
      role: "",
      name: "",
      tags: [],
      prod: "",
      dev: "",
      userid: "",
      admin: "",
      sortBy: "",
      price: "",
      type: "",
      unreadMessages: "",
      pendingOffers: "",
      requests: "",
      notificationCount: 0,
    };
  },
  created() {
    //Prüfen, ob Benutzer eingeloggt ist
    if (!store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
    //Name, ID und Rolle des eingeloggten Users werden in Variablen gespeichert
    this.username = store.getters.getUser.name;
    this.userid = store.getters.getUserID;
    this.role = store.getters.getUser.rolle;
    //Prüfung, ob Admin oder normaler User eingeloggt ist
    if (this.role == 1) {
      this.admin = "1";
    } else {
      this.admin = "0";
    }

    //Aus URL rausziehen
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //Filterparameter werden aus URL in Variablen gespeichert
    this.sortBy = urlParams.get("sortBy");
    this.price = urlParams.get("price");
    this.type = urlParams.get("type");
  },
  methods: {
    //Durch Klick auf Enter Suchbutton triggern
    pressEnter() {
      //Input-Bar identifizieren
      var input = document.getElementById("myInput");
      //nach Klicken des Enter-Buttons im Input-Feld wird der Such-Button getriggert
      input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
          //Suchleiste wird geleert und es wird nach Wort gesucht
          event.preventDefault();
          document.getElementById("myBtn").click();
        }
      });
    },

    //Logout-Funktion, die User ausloggt
    logout() {
      store.dispatch("logout");
      socket.disconnect();
      this.$router.push("/login");
    },
    //Überprüfen, ob Buchstaben in die Suchleiste eingegeben werden
    isLetter(e) {
      let char = String.fromCharCode(e.keyCode); // Get the character
      if (/^[a-zA-Z\s]*$/.test(char)) return true;
      // Match with regex
      else e.preventDefault(); // If not match, don't add to input text
    },
    //Benachrichtigungen für ungelesene Nachrichten bekommen
    getNotifications() {
      //Ungelesene Nachrichten werden, response= Anzahl aller ungelesenen Nachrichten, alle 10 sekunden wird überprüft, unreadmessages ist vorherige Anzahl aus respones
      getUnreadMessages(this.userid).then((response) => {
        if (response != this.unreadMessages) {
          this.notificationCount += response - this.unreadMessages;
          this.unreadMessages = response;
        }
      });

      //Benachrichtigungen-Offene Angebote nur für Admin holen
      if (this.role == 1) {
        getPendingOffers().then((response) => {
          if (response.length != this.pendingOffers) {
            this.notificationCount += response.length - this.pendingOffers;
            this.pendingOffers = response.length;
          }
        });
      }

      //Benachrichtigungen - Requests von Angeboten holen
      getRequests(this.username).then((response) => {
        if (response.length != this.requests) {
          this.notificationCount += response.length - this.requests;
          this.requests = response.length;
        }
      });
    },
  },
  mounted() {
    //Unterscheidung zwischen Development- und Produktionsumgebung
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }

    //Variable wird initial gesetzt unreadMessages
    getUnreadMessages(this.userid).then((response) => {
      this.unreadMessages = response;
      this.notificationCount += response;
    });

    if (this.role == 1) {
      getPendingOffers().then((response) => {
        this.pendingOffers = response.length;
        this.notificationCount += this.pendingOffers;
      });
    }

    getRequests(this.username).then((response) => {
      this.requests = response.length;
      this.notificationCount += this.requests;
    });
  },
  //aktualisiert URL, wenn sich etwas beim Filtern ändert
  watch: {
    $route(to) {
      this.sortBy = to.query.sortBy;
      this.price = to.query.price;
      this.type = to.query.type;
    },
  },
};
</script>