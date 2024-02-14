<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div
      class="border"
      style="
        margin-top: 20px;
        border: solid #ccc;
        border-width: thin thin;
        margin-right: 20%;
        margin-left: 20%;
        margin-bottom: 20px;
      "
      v-if="this.profilLoaded"
    >
      <div class="container">
        <div>
          <h1 class="card-heading" style="text-align: center">
            <u>Edit Profile</u>
          </h1>
        </div>
        <div class="card-body">
          <div class="imgcontainer">
            <img
              src="../assets/Portrait_Placeholder.png"
              alt="Avatar"
              class="avatar"
            />
          </div>
          <div class="row">
            <div class="col-sm-12 col-md-12" style="text-align: center">
              <div class="mb-6">
                <h4 class="mb-3">Username: {{ this.user.name }}</h4>
              </div>
              <div class="mb-4">
                <h4 class="mb-3">Email: {{ this.user.email }}</h4>
              </div>
              <div class="mb-4">
                <h4 class="box-title">
                  <router-link :to="{ path: '/statistics' }"
                    >Statistics</router-link
                  >
                </h4>
              </div>
            </div>
            <div class="col-md-12"></div>
            <div class="col-sm-6 col-md-4">
              <div class="mb-4" style="text-align: center">
                <h5><label class="form-label">Old password</label></h5>
                <input
                  class="form-control"
                  type="password"
                  v-model="old_password"
                  placeholder="********"
                />
              </div>
            </div>
            <div class="col-sm-6 col-md-4">
              <div class="mb-4" style="text-align: center">
                <h5><label class="form-label">New password</label></h5>
                <input
                  class="form-control"
                  type="password"
                  v-model="new_password_1"
                  placeholder="********"
                />
              </div>
            </div>

            <div class="col-sm-6 col-md-4">
              <div class="mb-4" style="text-align: center">
                <h5><label class="form-label">Confirm password</label></h5>
                <input
                  class="form-control"
                  type="password"
                  v-model="new_password_2"
                  placeholder="********"
                />
              </div>
            </div>
            <div class="col-md-12">
              <div class="mb-0">
                <h3><label class="form-label">About Me</label></h3>
                <textarea v-model="description" placeholder="Here can be your description" rows="5" class="form-control"></textarea>
                 <!-- <textarea :value="description" @input="$emit('input', $event.target.description)" rows="5" class="form-control"></textarea> -->
              </div>
            </div>
          </div>
        </div>
        <!-- Messages ans Frontend -->
        <div v-if="msg" class="alert alert-danger" role="alert">
          {{ this.msg }}
        </div>
        <div v-if="msg2" class="alert alert-success" role="alert">
          {{ this.msg2 }}
          <meta http-equiv="refresh" content="1">
        </div>
        <div v-if="msg3" class="alert alert-danger" role="alert">
          {{ this.msg3 }}
        </div>
        <div id="wrapper" class="text-end">
                    <button
            class="button button3"
            style="height: 55px; border: none; padding: 12px 40px"
            type="submit"
            @click="deleteProfile"
            v-on:click="isHidden = true"
          >
            <p v-if="!isHidden">Delete Profile</p>
            <p v-if="isHidden">Yes</p>
          </button>
          
          <button
            class="button button1"
            style="
              height: 55px;
              font-size: 19px;
              border: none;
              padding: 12px 40px;
            "
            type="submit"
            @click="resetPassword"
          >
            Update Profile
          </button>
 

        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
  position: relative;
}

img.avatar {
  width: 20%;
  border-radius: 50%;
}
</style>

<script>
import "bootstrap/dist/css/bootstrap.min.css";

import { getUser } from "../services/AngebotService";
import Navbar from "./Navbar.vue";
import store from "../store.js";
import { resetPW, deleteProfil, lockAll, setDescription } from "../services/SettingsService";
import Footer from "./Footer.vue";

export default {
  name: "Profil",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      description: "",
      offer: [],
      upload: null,
      kategorie: "",
      tags: [],
      prod: "",
      dev: "",
      userid: 0,
      offerid: 0,
      old_password: "",
      new_password_1: "",
      new_password_2: "",
      msg: "",
      msg2: "",
      msg3: "",
      isHidden: false,
      user: [],
      username: "",
      profilLoaded: "",
    };
  },
  methods: {
    async resetPassword() {
      try {
        const credentialSettings = {
          id: this.user.id,
          old_password: this.old_password,
          new_password_1: this.new_password_1,
          new_password_2: this.new_password_2,
        };

        // Liefert die Message zurück, ob ein Update erfolgreich war.
        // Falls ja, soll die Message in Grün ausgegeben werden.
        // Falls nein, in rot.
        const response = await resetPW(credentialSettings);
        // console.log(response)
        if (response.msg == "Updated!") {
          this.msg3 = "";
          this.msg = "";
          this.msg2 = response.msg;
          // Hier muss eine Methode rein, zum updaten der Benutzerbeschreibung


          console.log(this.description);

          const descriptionSettings = {
          id: this.user.id,
          description: this.description,
          };
          // Funktioniert, jetzt muss noch die API geschrieben werden + Backend
          console.log(descriptionSettings)
          const response2 = await setDescription(descriptionSettings);
          console.log(response2)

          console.log(this.msg2)
          
        } else {
          this.msg3 = "";
          this.msg2 = "";
          this.msg = response.msg;
        }
        this.isHidden = false;
        //
      } catch (error) {
        this.msg = error.response.data.msg;
      }
    },
    /**
     * Author: Jörg Adelhelm
     * Profil löschen -
     * Checkt zuerst ob der Button schon gedrückt wurde.
     * Wurde er gedrückt, so erscheint "Sind Sie sicher?" dies wird anhand der if-Abfrage überpüft
     * Wird der button nochmal gedrückt, so wird das Profil gelöscht.
     */
    async deleteProfile() {
      if (this.msg3 == "Are you sure?") {
        try {
          const profileSettings = {
            id: this.user.id,
            username: this.username,
          };

          console.log(profileSettings);

          // Sperrt alle Inhalte des Nutzers die mehr als 0€ kosten
          lockAll(profileSettings);

          // Löscht das Profil des Nutzers
          deleteProfil(profileSettings);

          this.$router.push("/login");
        } catch (error) {
          this.msg = error.response.data.msg;
        }
      }
      this.msg3 = "Are you sure?";
      this.msg = "";
      this.msg2 = "";
      // console.log(deleteCredentials)
    },
    dummyMethod() {
      deleteProfil();
    },
  },
  mounted() {
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }

    // Hier wird die user_id jetzt vom store statt von der
    // URL geholt
    const user_id = store.getters.getUserID;
    // console.log(user_id);

    // Daten des Nutzers
    getUser(user_id).then((response) => {
      this.user = response;
      // console.log(this.user.name);
      this.profilLoaded = "true";
    });

    // Password zurücksetzen
  },

  async created() {
    if (!store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
    this.username = store.getters.getUser.name;
  },
};
</script>
<style>
#wrapper {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  background-color: #4caf50; /* Green */
  border: none;
  color: grey;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
}

.button1 {
  background-color: rgba(11, 136, 11, 0.603);
  color: white;
  border: 2px solid #4caf50;
  width: 100%;
  border-radius: 12px;
  padding: 14px 40px;
  font-size: 24px;
}

.button1:hover {
  background-color: #008a05;
  color: white;
  width: 100%;
  border-radius: 12px;
  padding: 14px 40px;
  font-size: 24px;
}

.button3 {
  background-color: #ff3333dc;
  color: white;
  border: 1px solid #ff1908;
  width: 100%;
  border-radius: 12px;
  padding: 10px 24px;
  font-size: 20px;
}

.button3:hover {
  background-color: #f81707;
  color: white;
  width: 100%;
  border-radius: 12px;
  padding: 10px 24px;
  font-size: 20px;
}
</style>