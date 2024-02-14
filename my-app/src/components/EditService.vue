<template>
  <div class="d-flex flex-column min-vh-100" style="text-align: center">
    <Navbar />
    <div
      class="border"
      style="
        margin-top: 20px;
        margin-bottom: 20px;
        border: solid #ccc;
        border-width: thin thin;
        margin-right: 15%;
        margin-left: 15%;
      "
    >
      <div class="container">
        <h1>Edit a Service</h1>
        <p>You can change the values to edit a Service.</p>

        <label for="psw"><b>Name</b></label>
        <input type="text" v-model="service.name" required />
        <div class="mb-4">
          <label for="psw"><b>Description</b></label>
          <textarea
            class="form-control"
            rows="3"
            v-model="service.description"
            maxlength="255"
          ></textarea>
        </div>
        <label for="psw"><b>Category</b></label>
        <input type="text" v-model="service.kategorie" required />
        <label for="psw"><b>Tags</b></label>
        <input type="text" v-model="service.tags" required />
        <label for="psw"><b>Placeholder</b></label>
        <div>
          <div class="btn-group" data-toggle="buttons">
            <label class="btn btn-secondary" style="margin-right: 20px">
              <input
                type="radio"
                name="options"
                id="option1"
                @click="servicePath(1)"
                style="display: none"
              />Image
            </label>
            <label class="btn btn-secondary" style="margin-right: 20px">
              <input
                type="radio"
                name="options"
                id="option2"
                @click="servicePath(2)"
                style="display: none"
              />Video
            </label>
            <label class="btn btn-secondary" style="margin-right: 20px">
              <input
                type="radio"
                name="options"
                id="option3"
                @click="servicePath(3)"
                style="display: none"
              />Audio
            </label>
            <label class="btn btn-secondary" style="margin-right: 20px">
              <input
                type="radio"
                name="options"
                id="option3"
                @click="servicePath(4)"
                style="display: none"
              />Document
            </label>
            <label class="btn btn-secondary" style="margin-right: 20px">
              <input
                type="radio"
                name="options"
                id="option3"
                @click="servicePath(5)"
                style="display: none"
              />IT-Service
            </label>
            <label class="btn btn-secondary">
              <input
                type="radio"
                name="options"
                id="option3"
                @click="servicePath(6)"
                style="display: none"
              />Physical-Service
            </label>
          </div>
        </div>
        <button
          type="submit"
          @click.prevent="updateService"
          class="publishbtn"
        >
          Edit
        </button>
        <p v-if="msg">{{ msg }}</p>
        <router-link :to="{ path: '/services' }">
          <button class="cancelbtn">Cancel</button>
        </router-link>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { updateService, getService } from "../services/CreatorService";
import Navbar from "./Navbar.vue";
import store from "../store.js";
import Footer from "./Footer.vue";

export default {
  name: "EditService",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      service: [],
      serviceLoaded: "",
      username: "",
      userid: "",
      kategorie: "",
      newname: "",
      tags: [],
      prod: "",
      dev: "",
      description: "",
      path: "",
      msg: "",
      role: 0,
      serviceid: 0,
    };
  },
  async created() {
    if (!store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
    this.username = store.getters.getUser.name;
    this.userid = store.getters.getUserID;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const service_id = urlParams.get("id");
    this.serviceid = service_id;
    console.log(this.offerid);
  },
  methods: {
    servicePath(p) {
      console.log(p);
      switch (p) {
        case 1:
          this.path = "service/image_placeholder.png";
          break;
        case 2:
          this.path = "service/video_placeholder.png";
          break;
        case 3:
          this.path = "service/audio_placeholder.png";
          break;
        case 4:
          this.path = "service/document_placeholder.png";
          break;
        case 5:
          this.path = "service/it_placeholder.png";
          break;
        case 6:
          this.path = "service/physical_placeholder.png";
          break;
        default:
          break;
      }
    },

    updateService() {
      console.log(this.path);
      updateService(
        this.serviceid,
        this.service.name,
        this.service.description,
        this.service.kategorie,
        this.service.tags,
        this.path
      ).then((response) => {
        this.msg = response.msg;
        this.$router.push("/services");
      });
    },
  },
  mounted() {
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }

    //this.userid = store.getters.getUserID;
    //this.role = store.getters.getUser.rolle;

    getService(this.serviceid).then((response) => {
      this.service = response;
      this.path = response.pfad;
      this.serviceLoaded = "true";

      // Avg_rating für das Frontend
      /* getRating(response.id).then((response2) => {
        this.avg_rating = response2[0].avg_rating;
        this.reviews = response2[0].reviews;
      }); */
    });
  },
};
</script>

<style scoped>
.container {
  padding: 16px;
}

/* Full-width input fields */
input[type="text"] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

input[type="text"]:focus {
  background-color: #ddd;
  outline: none;
}

/* Set a style for the submit/register button */
.publishbtn {
  background-color: rgb(2, 143, 65);
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

.cancelbtn {
  background-color: rgb(255, 64, 64);
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

.publishbtn:hover .cancelbtn:hover {
  opacity: 1;
}
</style>