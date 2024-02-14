<template>
  <div
    class="d-flex flex-column min-vh-100"
    style="text-align: center"
    v-if="this.loaded"
  >
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
        <h1>Publish</h1>
        <p>Please fill in this form to publish a file.</p>
        <!-- 
          Hier kommt das Bild zum Taggen rein über den Pfad
         -->
        <div class="white-box text-center">
          <!--Beim Bild Unterscheidung zwischen Prod und Development-->
          <div
            v-if="dev"
            class="child inline-block-child"
            style="vertical-align: top"
          >
            <!--Bild als Medium-->
            <img
              v-if="this.offer.dateityp === 'image'"
              :src="require('@/assets/files/' + this.offer.pfad)"
              width="30%"
              class="img-responsive"
            />
            <!--Audio als Medium-->
            <img
              v-if="this.offer.dateityp === 'audio'"
              :src="require('@/assets/audio_placeholder.png')"
              width="30%"
              class="img-responsive"
            />
            <!--Video als Medium-->
            <img
              v-if="this.offer.dateityp === 'video'"
              :src="require('@/assets/files/' + this.offer.thumbnailpfad)"
              width="30%"
              class="img-responsive"
            />
            <!--gltf als Medium-->
            <div
              style="width: 800px; margin: 0 auto"
              v-if="this.offer.dateityp === 'glb'"
              id="modelDiv"
            >
              <ThreeModel :path="this.offer.pfad" />
            </div>
          </div>
          <!--Seite für Prod-->
          <div
            v-if="prod"
            class="child inline-block-child"
            style="vertical-align: top"
          >
            <img
              v-if="this.offer.dateityp === 'image'"
              :src="
                'https://teamprojektstorage.blob.core.windows.net/files/' +
                this.offer.pfad
              "
              width="30%"
              class="img-responsive"
            />
            <img
              v-if="this.offer.dateityp === 'audio'"
              :src="require('@/assets/audio_placeholder.png')"
              width="30%"
              class="img-responsive"
            />
            <img
              v-if="this.offer.dateityp === 'video'"
              :src="
                'https://teamprojektstorage.blob.core.windows.net/files/' +
                this.offer.thumbnailpfad
              "
              width="30%"
              class="img-responsive"
            />
            <div
              class="card-img-top embed-responsive-item"
              v-if="offer.dateityp === 'glb'"
              id="modelDiv"
            >
              <ThreeModel
                :path="
                  'https://teamprojektstorage.blob.core.windows.net/files/' +
                  this.offer.pfad
                "
              />
            </div>
          </div>
        </div>
        <!-- 
  
 -->
        <label for="psw"><b>Name</b></label>
        <input type="text" placeholder="Name" v-model="name" required />
        <div class="mb-0">
          <label for="psw"><b>Description</b></label>
          <textarea
            class="form-control"
            rows="3"
            placeholder="Description..."
            v-model="description"
            maxlength="255"
          ></textarea>
        </div>

        <label for="psw"><b>License</b></label>
        <div>
          <div class="btn-group" data-toggle="buttons">
            <label class="btn btn-secondary" style="margin-right: 20px">
              <input
                type="radio"
                name="options"
                id="option1"
                @click="licenseHandler(1)"
                style="display: none"
              />
              For Free
            </label>
            <label class="btn btn-secondary" style="margin-right: 20px">
              <input
                type="radio"
                name="options"
                id="option2"
                @click="licenseHandler(2)"
                style="display: none"
              />
              For Sale
            </label>
            <label class="btn btn-secondary">
              <input
                type="radio"
                name="options"
                id="option3"
                @click="licenseHandler(3)"
                style="display: none"
              />
              HS Fulda only
            </label>
          </div>
        </div>
        <label for="psw"><b>Price</b></label>
        <input type="text" placeholder="Price" v-model="price" required />
        <label for="psw"><b>Category</b></label>
        <div>
          <div class="btn-group" data-toggle="buttons">
            <label class="btn btn-secondary" style="margin-right: 20px">
              <input
                type="radio"
                name="options"
                id="option4"
                @click="categoryHandler(1)"
                style="display: none"
              />
              Education
            </label>
            <label class="btn btn-secondary" style="margin-right: 20px">
              <input
                type="radio"
                name="options"
                id="option5"
                @click="categoryHandler(2)"
                style="display: none"
              />
              Leisure
            </label>
            <label class="btn btn-secondary" style="margin-right: 20px">
              <input
                type="radio"
                name="options"
                id="option6"
                @click="categoryHandler(3)"
                style="display: none"
              />
              Culture
            </label>
          </div>
        </div>
        <label for="psw"><b>Tags</b></label>

        <div>
          <button
            type="submit"
            @click.prevent="autoTagging"
            class="btn btn-warning"
          >
            Start Image Tagging
          </button>
          <p></p>
        </div>
        <input type="text" placeholder="Tags" v-model="tags" required />
        <button type="submit" @click.prevent="publishFile" class="publishbtn">
          Publish
        </button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { publishFile } from "../services/AngebotService";
import { getMedium } from "../services/TaggingService";
import Navbar from "./Navbar.vue";
import store from "../store.js";
import Footer from "./Footer.vue";
import ThreeModel from "./ThreeModel.vue";

export default {
  name: "Publish",
  components: {
    Navbar,
    Footer,
    ThreeModel,
  },
  data() {
    return {
      query: "",
      itemid: "",
      username: "",
      userid: "",
      price: 0,
      license: "",
      category: "",
      name: "",
      tags: [],
      prod: "",
      dev: "",
      description: "",
      offer: [],
      loaded: "",
    };
  },
  async created() {
    if (!store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const query = urlParams.get("id");

    getMedium(query).then((response) => {
      this.offer = response;
      this.loaded = "true";
    });

    this.username = store.getters.getUser.name;
    this.userid = store.getters.getUserID;
    this.itemid = query;
  },
  methods: {
    publishFile() {
      console.log(this.upload);
      console.log(this.description);
      publishFile(
        this.itemid,
        this.username,
        this.name,
        this.description,
        this.category,
        this.tags,
        this.price,
        this.license,
        this.description
      ).then((response) => {
        console.log(response);
        this.$router.push({ path: "uploads" });
      });
    },
    // Button zum automatischen Tagging
    autoTagging() {
      console.log("START TAGGING");

      const cloudinary = require("cloudinary").v2;

      cloudinary.config({
        cloud_name: "dzngggim0",
        api_key: "YOURAPIKEY",
        api_secret: "XV6PW-bPVRseD5D3pLxVSPZM5RU",
      });
    },
    //
    licenseHandler(selected) {
      switch (selected) {
        case 1:
          this.license = "For Free";
          break;
        case 2:
          this.license = "For Sale";
          break;
        case 3:
          this.license = "Hochschule Fulda only";
          break;

        default:
          break;
      }
      console.log(this.license);
    },
    categoryHandler(selected) {
      switch (selected) {
        case 1:
          this.category = "Education";
          break;
        case 2:
          this.category = "Leisure";
          break;
        case 3:
          this.category = "Culture";
          break;
        // case 3:
        //   this.category = "Art";
        //   break;
        // case 4:
        //   this.category = "Photography";
        //   break;
        // case 5:
        //   this.category = "Sport";
        //   break;

        default:
          break;
      }
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