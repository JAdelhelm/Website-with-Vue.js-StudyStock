<template>
  <div class="d-flex flex-column min-vh-100">
    <!--Navbar einbinden-->
    <Navbar />
    <div class="container" v-if="this.offerLoaded">
      <!--Detailseite als Karte erstellen-->
      <div class="card">
        <!--Inhalt in den Body der Karte-->
        <div class="card-body">
          <!--Name des Angebots als Titel-->
          <h3 class="card-title">
            <u>{{ this.offer.name }}</u>
          </h3>
          <!--Reihe innerhalb des Bodys erstellen-->
          <div class="row">
            <!--Spalte mit einer festen Größe erstellen-->
            <div class="col-lg-6 col-md-6 col-sm-6">
              <div class="white-box text-center">
                <!--Beim Bild Unterscheidung zwischen Prod und Development-->
                <div
                  v-if="dev"
                  class="embed-responsive embed-responsive-4by3"
                  style="vertical-align: top; border-style: solid"
                >
                  <!--Bild als Medium-->
                  <img
                    v-if="offer.dateityp === 'image'"
                    :src="
                      offer.lizenz == 'For Free'
                        ? require('@/assets/files/' + offer.pfad)
                        : require('@/assets/files/' + offer.thumbnailpfad)
                    "
                    class="card-img-top embed-responsive-item"
                    alt="Card image cap"
                  />
                  <!--Audio als Medium-->
                  <img
                    v-if="offer.dateityp === 'audio'"
                    :src="require('@/assets/audio_placeholder.png')"
                    class="card-img-top embed-responsive-item"
                    alt="Card image cap"
                  />
                  <!--Video als Medium-->
                  <img
                    v-if="offer.dateityp === 'video'"
                    :src="require('@/assets/files/' + offer.thumbnailpfad)"
                    class="card-img-top embed-responsive-item"
                    alt="Card image cap"
                  />
                  <div
                    class="card-img-top embed-responsive-item"
                    v-if="offer.dateityp === 'glb'"
                    id="modelDiv"
                  >
                    <ThreeModel :path="offer.pfad" />
                  </div>
                </div>
                <!--Seite für Prod-->
                <div
                  v-if="prod"
                  class="embed-responsive embed-responsive-4by3"
                  style="vertical-align: top; border-style: solid"
                >
                  <img
                    v-if="offer.dateityp === 'image'"
                    :src="
                      offer.lizenz == 'For Free'
                        ? 'https://teamprojektstorage.blob.core.windows.net/files/' +
                          offer.pfad
                        : 'https://teamprojektstorage.blob.core.windows.net/files/' +
                          offer.thumbnailpfad
                    "
                    class="card-img-top embed-responsive-item"
                    alt="Card image cap"
                  />
                  <img
                    v-if="offer.dateityp === 'audio'"
                    :src="require('@/assets/audio_placeholder.png')"
                    class="card-img-top embed-responsive-item"
                    alt="Card image cap"
                  />
                  <img
                    v-if="offer.dateityp === 'video'"
                    :src="
                      'https://teamprojektstorage.blob.core.windows.net/files/' +
                      offer.thumbnailpfad
                    "
                    class="card-img-top embed-responsive-item"
                    alt="Card image cap"
                  />
                  <div
                    class="card-img-top embed-responsive-item"
                    v-if="offer.dateityp === 'glb'"
                    id="modelDiv"
                  >
                    <ThreeModel
                      :path="
                        'https://teamprojektstorage.blob.core.windows.net/files/' +
                        offer.pfad
                      "
                    />
                  </div>
                </div>
              </div>
              <div class="h-25"> 
                <h3 class="box-title mt-5">Statistics</h3>
                <div>
                  <LineChart :offerid="this.offerid" />
                </div>
              </div>
            </div>
            <!--Zweite Spalte für Inhalte des Mediums-->
            <div class="col-lg-6 col-md-6 col-sm-6">
              <!--User, der Medium erstellt hat-->
              <h4 class="box-title">
                User:
                <router-link
                  :to="{ path: '/user', query: { id: offer.user_id } }"
                  >{{ this.offer.username }}</router-link
                >
              </h4>
              <!--Bewertung des Mediums-->
              <h4>Rating: <StarRating></StarRating></h4>
              <!--  

              


               -->
              <!-- <p>Average Rating is: {{ Math.round(this.avg_rating) }} / 5</p> -->
              <h5>Reviews: {{ this.reviews }}</h5>
              <!--Beschreibung des Mediums-->
              <h4 class="box-title mt-4">Product description</h4>
              <p>
                {{ this.offer.description }}
              </p>
              <!--Dateityp des Mediums-->
              <h4 class="box-title mt-4">
                File-Type: {{ this.offer.dateityp }}
              </h4>
              <!--Reihe innerhalb der Spalte, um Preis und Contact in einer Reihe zu zeigen-->
              <div class="row">
                <div class="col-md-7">
                  <!--Preis des Mediums-->
                  <h2 class="d-inline-block mt-4">
                    Price: {{ this.offer.preis }}€
                  </h2>
                  <!--Weiterleitung zum Chat-->
                  <router-link
                    :to="{
                      path: '/chat',
                      query: {
                        offerUser: this.offer.user_id,
                        offerID: this.offer.id,
                        offerName: this.offer.name,
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
                        margin-left: 4px;
                        margin-bottom: 10px;
                      "
                      class="btn mt-auto btn-rounded"
                    >
                      Contact
                    </button>
                  </router-link>
                </div>
              </div>
              <span v-if="offer.dateityp == 'image'">
                <!--Qualität des Mediums wählen-->
                <h4 class="box-title mt-4">Quality:</h4>
                <select
                  class="form-control"
                  title="Quality"
                  aria-label="Default select example"
                  v-model="selectedQuality"
                  style="margin-right: 15px; margin-bottom: 15px"
                >
                  <option
                    v-for="quality in qualityCollection"
                    v-bind:value="{ id: quality.id, value: quality.value }"
                    :key="quality.id"
                  >
                    {{ quality.value }}
                  </option>
                </select>
              </span>
              <!--Download-Button-->
              <!--Unterscheidung zwischen kostenlosem und kostenpflichtigen Medien-->
              <button
                v-if="free"
                style="
                  background-color: rgb(2, 143, 65);
                  color: white;
                  border: none;
                  cursor: pointer;
                  margin-right: 15px;
                  margin-bottom: 15px;
                "
                class="btn mt-auto btn-rounded"
              >
                <a style="color: white" @click="downloadAngebot(offer.id)">
                  Download
                </a>
              </button>

              <button
                v-if="!free"
                disabled
                style="
                  background-color: rgb(2, 143, 65);
                  color: white;
                  border: none;
                  cursor: pointer;
                  margin-right: 15px;
                  margin-bottom: 15px;
                  pointer-events: none;
                  cursor: default;
                "
                class="btn mt-auto btn-rounded"
              >
                <a style="color: white" @click="downloadAngebot(offer.id)"
                  >Download</a
                >
              </button>
              <div>
                <button
                  @click="deleteAngebot()"
                  v-if="this.role == 1"
                  type="submit"
                  style="
                    background-color: rgb(255, 64, 64);
                    color: white;
                    border: none;
                    cursor: pointer;
                  "
                  class="btn mt-auto btn-rounded"
                >
                  Delete Offer
                </button>
              </div>
              <!--Tabelle mit weiteren Informationen zu dem Medium erstellen-->
              <h3 class="box-title mt-5">General Info</h3>
              <div class="table-responsive">
                <table class="table table-striped table-product">
                  <tbody>
                    <tr>
                      <td>License:</td>
                      <td>{{ this.offer.lizenz }}</td>
                    </tr>
                    <tr>
                      <td>Category:</td>
                      <td>{{ this.offer.kategorie }}</td>
                    </tr>
                    <tr>
                      <td>Tags:</td>
                      <td>{{ this.offer.tags }}</td>
                    </tr>
                    <tr v-if="this.offer.dateityp == 'image'">
                      <td>Resolution:</td>
                      <td>
                        {{ this.offer.metadaten[0].width }} x
                        {{ this.offer.metadaten[0].height }}
                      </td>
                    </tr>
                    <tr
                      v-if="
                        this.offer.dateityp == 'audio' ||
                        this.offer.dateityp == 'video'
                      "
                    >
                      <td>Length:</td>
                      <td>{{ this.offer.metadaten[0].length }}</td>
                    </tr>
                    <tr v-if="this.offer.dateityp == 'glb'"></tr>
                    <tr>
                      <td>Date of creation:</td>
                      <td>{{ this.offer.datum_angebot }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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

<script>
//Notwendige Methoden einbinden
import {
  getAngebot,
  downloadAngebot,
  lockOffer,
  download,
} from "../services/AngebotService";
import Navbar from "./Navbar.vue";
import store from "../store.js";
import StarRating from "./star-rating.vue";
import { getRating } from "../services/RatingService";
import { checkRequestStatus } from "../services/RequestService";
import Footer from "./Footer.vue";
import LineChart from "./LineChartOffer.vue";
import moment from "moment";
import Content from "./Content.vue";
import ThreeModel from "./ThreeModel.vue";

export default {
  name: "Offer",
  components: {
    Navbar,
    StarRating,
    Footer,
    Content,
    ThreeModel,
    LineChart,
  },
  data() {
    return {
      offer: [],
      offerLoaded: "",
      upload: null,
      kategorie: "",
      tags: [],
      prod: "",
      dev: "",
      userid: 0,
      offerid: 0,
      username: "",
      free: "",
      avg_rating: 0,
      reviews: 0,
      role: 0,
      price: 0,
      quality: 3,
      selectedQuality: "",
      qualityCollection: [
        { id: 1, value: "Low" },
        { id: 2, value: "Medium" },
        { id: 3, value: "High" },
      ],
    };
  },
  methods: {
    //Methode zum Download eines Angebots
    downloadAngebot(id) {
      this.userid = store.getters.getUserID;

      download(id, this.selectedQuality.value)
        .then((res) => {
          // File downloaden
          var contentDisposition = res.headers["content-disposition"];
          var match = contentDisposition.match(/filename\s*=\s*"(.+)"/i);
          var filename = match[1];

          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();

          //Für Downloadhistory Eintrag in DB schreiben
          downloadAngebot(this.userid, id).then((res) => {
            console.log(res);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deleteAngebot() {
      lockOffer(this.offerid);
      this.$router.push("/");
    },
  },
  mounted() {
    //Unterscheidung zwischen Prod und Dev
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }

    this.userid = store.getters.getUserID;
    this.role = store.getters.getUser.rolle;

    checkRequestStatus(this.userid, this.offerid).then((response) => {
      //Wenn es eine bestätigte Anfrage für das Angebot gibt -> Download button freigeben
      try {
        if (response[0].bestaetigt == 1) {
          this.free = "free";
        }
      } catch (error) {
        console.log(
          "Benutzer hat noch keine Anfrage für das Medium gesendet -> Download disabled"
        );
      }
    });

    getAngebot(this.offerid).then((response) => {
      this.offer = response;
      this.offerLoaded = "true";
      this.offer.metadaten = JSON.parse(this.offer.metadaten);
      this.offer.datum_angebot = moment(this.offer.datum_angebot)
        .utc()
        .add(2, "hours")
        .format("LLL");

      //Wenn Angebot Kostenlos ist download button freischalten
      if (this.offer.preis == 0) {
        this.free = "free";
      }

      if (this.offer.username == this.username || this.role == 1) {
        this.free = "free";
      }

      // Avg_rating für das Frontend
      getRating(response.id).then((response2) => {
        this.avg_rating = response2[0].avg_rating;
        this.reviews = response2[0].reviews;
      });
    });
  },
  created() {
    //Prüfen, ob User eingeloggt ist
    if (!store.getters.isLoggedIn) {
      this.$router.push("/login");
    }

    this.username = store.getters.getUser.name;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const offer_id = urlParams.get("id");
    this.offerid = offer_id;
    console.log(this.offerid);
    this.selectedQuality = this.qualityCollection[2];
  },
};
</script>

<style scoped></style>
