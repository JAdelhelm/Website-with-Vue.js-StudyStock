<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="grid-container-element">
      <nav>
        <div class="left-panel child">
          <user
            v-for="user in users"
            :key="user.userID"
            :user="user"
            :selected="selectedUser === user"
            @select="onSelectUser(user)"
          />
        </div>
      </nav>
      <div class="right-panel child">
        <message-panel
          v-if="selectedUser"
          :user="selectedUser"
          @input="onMessage"
        />
      </div>
    </div>
    <p id="requestMessage" v-if="msg">{{ msg }}</p>
    <Footer />
  </div>
</template>

<script>
import socket from "../socket";
import User from "./User";
import MessagePanel from "./MessagePanel";
import Navbar from "./Navbar.vue";
import store from "../store";
import Footer from "./Footer.vue";
import { getMessages, readMessages } from "../services/MessageService";

export default {
  name: "Chat",
  components: { User, MessagePanel, Navbar, Footer },
  data() {
    return {
      user: null,
      selectedUser: null,
      users: [],
      usernameAlreadySelected: false,
      offerID: 0,
      offerName: "",
      initialOfferUser: 0,
      msg: "",
      messages: [],
    };
  },
  methods: {
    onMessage(content) {
      //Überprüfen ob valider Benutzer
      if (this.selectedUser) {
        //Überprüfen ob es sich um eine Anfrage handelt
        if (this.offerID && this.initialOfferUser) {
          this.msg = "Request for offer " + this.offerName + " has been sent";
        }
        //geschriebene Nachricht an den Websocket senden
        socket.emit("private message", {
          content,
          to: this.selectedUser.userID,
          offerID: this.offerID,
          initialOfferUser: this.initialOfferUser,
        });

        var current = new Date();

        //Die Nachricht beim selektierten Benutzer auf den message Stack schreiben um die Nachricht beim Absender zu sehen
        this.selectedUser.messages.push({
          content,
          fromSelf: true,
          read: 0,
          time: current.toLocaleTimeString(),
        });
      }
    },
    onSelectUser(user) {
      //Nach dem Auswählen eines Benutzers alle seine Nachrichten aus dem MessageStore holen
      getMessages(store.getters.getUser.id, user.userID).then((response) => {
        this.messages = response;
      });

      //Wenn es bei dem ausgewählten Benutzer ungelesene Nachrichten gibt
      if (user.hasNewMessages == true) {
        //Nachrichten auf gelesen setzen
        readMessages(store.getters.getUser.id, user.userID).then((response) => {
          this.messages = response;
        });
      }

      this.selectedUser = user; //selectedUser wird zum ausgewählten User
      user.hasNewMessages = false; //Beim User gibt es nun für einen selber keine ungelesenen Nachrichten mehr
    },
    onUsernameSelection(username) {
      //Beim socket per username authentifizieren und verbinden
      this.usernameAlreadySelected = true;
      socket.auth = { username };
      socket.connect();
    },
    getUser(user) {
      //Nur wichtig für Contact Button in Offer - Alle user durchlaufen und den richtigen User vorselektieren
      this.users.forEach((element) => {
        if (element.userID == user) {
          this.onSelectUser(element);
        }
      });
    },

    initReactiveProperties(user) {
      user.hasNewMessages = false; //hasNewMessages eines Benutzers auf false setzen
      //Alle Nachrichten des User durchlaufen
      user.messages.forEach((element) => {
        if (element.read == 0) {
          user.hasNewMessages = true; //hasNewMessages auf true setzen wo read = 0 ist
        }
      });
    },
  },
  mounted() {
    this.user = store.getters.getUser;
    this.onUsernameSelection(this.user.name);
  },
  created() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const offerUser = urlParams.get("offerUser");
    const offerID = urlParams.get("offerID");
    const offerName = urlParams.get("offerName");
    this.offerID = offerID;
    this.initialOfferUser = offerUser;
    this.offerName = offerName;

    //Wenn Benutzer schon eine Session hat
    socket.on("session", ({ sessionID, userID }) => {
      //SessionID an die nächsten Wiederverbindungsversuche anhängen
      socket.auth = { sessionID };
      //SessionIDIm localStorage speichern
      localStorage.setItem("sessionID", sessionID);
      //userID des Benutzers im socket speichern
      socket.userID = userID;
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.usernameAlreadySelected = false;
      }
    });

    //Wenn aktueller Benutzer sich verbindet -> Connection auf true setzen
    socket.on("connect", () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });
    });

    //Wenn aktueller Benutzer die Verbindung trennt -> Connection auf false setzen
    socket.on("disconnect", () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
    });

    //User-Liste erstellen
    //users ist ein array mit allen bekannten usern
    socket.on("users", (users) => {
      users.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
          //Wenn Nachricht von einem selbst kommt => nachricht schon auf gelesen setzen
          if (message.fromSelf) {
            message.read = 1;
          }
        });
        for (let i = 0; i < this.users.length; i++) {
          const existingUser = this.users[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            existingUser.messages = user.messages;
            return;
          }
        }
        user.self = user.userID === socket.userID;
        this.initReactiveProperties(user);
        this.users.push(user);
      });

      //Aktuellen User in der User-Liste nach oben sortieren
      this.users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      //Angebotsersteller als selectedUser auswählen
      this.getUser(offerUser);
    });

    //Wenn ein anderer Benutzer sich verbindet -> seine connection auf true setzen
    socket.on("user connected", (user) => {
      for (let i = 0; i < this.users.length; i++) {
        const existingUser = this.users[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }

      this.initReactiveProperties(user);
      this.users.push(user);
    });

    //Wenn ein anderer Benutzer die Verbindung trennt -> seine connection auf false setzen
    socket.on("user disconnected", (id) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
    });

    //Wenn eine Nachricht kommt, schauen von wem sie kommt und flags dementsprechend setzen
    socket.on("private message", ({ content, from, to }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          var current = new Date();

          user.messages.push({
            content,
            fromSelf,
            read: 0,
            time: current.toLocaleTimeString(),
          });

          if (user !== this.selectedUser) {
            this.initReactiveProperties(user);
          } else {
            //Nachrichten auf gelesen setzen
            readMessages(to, from).then((response) => {
              this.messages = response;
            });
          }

          break;
        }
      }
    });
  },
  destroyed() {
    socket.disconnect();
    //Beim Verlassen der Seite alle Listener entfernen
    socket.off("connect_error");
    socket.off("connect");
    socket.off("disconnect");
    socket.off("users");
    socket.off("user connected");
    socket.off("user disconnected");
    socket.off("private message");
  },
};
</script>

<style scoped>
.left-panel {
  width: 300px;
  height: 625px;
  overflow: hidden;
  overflow-y: scroll;
}

.grid-container-element {
  display: grid;
  grid-template-columns: 1fr 6fr;
}
.grid-child-element {
  margin: 10px;
}
#requestMessage {
  text-align: center;
  font-weight: bold;
  font-size: 18px;
}
</style>