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
        <h1>Create a new Service</h1>
        <p>Please fill in this form to create a new Service.</p>

        <label for="psw"><b>Name</b></label>
        <input type="text" placeholder="Name" v-model="name" required />
        <div class="mb-4">
          <label for="psw"><b>Description</b></label>
          <textarea
            class="form-control"
            rows="3"
            placeholder="Description..."
            v-model="description"
            maxlength="255"
          ></textarea>
        </div>
        <label for="psw"><b>Category</b></label>
        <input type="text" placeholder="Category" v-model="category" required />
        <label for="psw"><b>Tags</b></label>
        <input type="text" placeholder="Tags" v-model="tags" required />
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
          @click.prevent="publishService"
          class="publishbtn"
        >
          Publish
        </button>
        <p v-if="msg">{{ msg }}</p>
        <p style="margin-top: 10px">Or do you want to upload a file instead?</p>
        <router-link :to="{ path: '/upload' }">
          <button class="publishbtn">Upload a file!</button>
        </router-link>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { publishService } from "../services/CreatorService";
import Navbar from "./Navbar.vue";
import store from "../store.js";
import Footer from "./Footer.vue";

export default {
  name: "NewService",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      username: "",
      userid: "",
      category: "",
      name: "",
      tags: [],
      prod: "",
      dev: "",
      description: "",
      path: "",
      msg: "",
    };
  },
  async created() {
    if (!store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
    this.username = store.getters.getUser.name;
    this.userid = store.getters.getUserID;
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

    publishService() {
      console.log(this.path);
      publishService(
        this.username,
        this.name,
        this.description,
        this.category,
        this.tags,
        this.path
      ).then((response) => {
        this.msg = response.msg;
      });
    },
  },
  mounted() {
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }
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

.publishbtn:hover {
  opacity: 1;
}
</style>