<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="text-center" v-if="offers.length > 0">
      <div
        class="text-center"
        style="
          margin-right: 50px;
          margin-left: 50px;
          margin-bottom: 20px;
          margin-top: 20px;
        "
      >
        <h3><u>My Offers</u></h3>
        <div class="row" v-for="i in Math.ceil(offers.length / 4)" :key="i">
          <div
            class="col-md-3"
            v-for="offer in offers.slice((i - 1) * 4, i * 4)"
            :key="offer.id"
          >
            <div class="card-group h-100">
              <div class="card" style="width: 18rem">
                <div class="card-body d-flex flex-column">
                  <div
                    v-if="dev"
                    class="embed-responsive embed-responsive-4by3"
                    style="vertical-align: top"
                  >
                    <img
                      v-if="offer.dateityp === 'image'"
                      :src="require('@/assets/files/' + offer.pfad)"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="offer.dateityp === 'audio'"
                      :src="require('@/assets/audio_placeholder.png')"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="offer.dateityp === 'video'"
                      :src="require('@/assets/files/' + offer.thumbnailpfad)"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <div
                      class="card-img-top embed-responsive-item"
                      v-if="offer.dateityp === 'glb'"
                      id="modelDiv"
                    >
                      <ThreeModel :path="offer.pfad" />
                    </div>
                  </div>
                  <div
                    v-if="prod"
                    class="embed-responsive embed-responsive-4by3"
                    style="vertical-align: top"
                  >
                    <img
                      v-if="offer.dateityp === 'image'"
                      :src="
                        'https://teamprojektstorage.blob.core.windows.net/files/' +
                        offer.pfad
                      "
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="offer.dateityp === 'audio'"
                      :src="require('@/assets/audio_placeholder.png')"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="offer.dateityp === 'video'"
                      :src="
                        'https://teamprojektstorage.blob.core.windows.net/files/' +
                        offer.thumbnailpfad
                      "
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
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
                  <h2>
                    <u>{{ offer.dateiname }}</u>
                  </h2>
                  <p class="title">
                    <b>Date:</b> {{ offer.datum_hinzugefuegt }}
                  </p>
                  <p class="title"><b>Type:</b> {{ offer.dateityp }}</p>
                </div>
                <p>
                  <button
                    style="
                      background-color: rgb(255, 64, 64);
                      color: white;
                      border: none;
                      cursor: pointer;
                      width: 80%;
                      padding: 8px;
                    "
                    class="mt-auto"
                    @click="deleteOffer(offer.id)"
                  >
                    Delete
                  </button>
                </p>
                <p>
                  <router-link
                    :to="{ path: '/offer', query: { id: offer.id } }"
                  >
                    <button
                      style="
                        background-color: rgb(2, 143, 65);
                        color: white;
                        border: none;
                        cursor: pointer;
                        width: 80%;
                        padding: 8px;
                      "
                      class="mt-auto"
                    >
                      More
                    </button>
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-else>
      <h3><u>My Offers</u></h3>
      <Content />
    </div>
    <Footer />
  </div>
</template>

<script>
import { getOfferHistory } from "../services/AngebotService";
import { deleteOffer } from "../services/AngebotService";
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
import Content from "./Content.vue";
import moment from "moment";
import store from "../store";
import ThreeModel from "./ThreeModel.vue";

export default {
  name: "Offers",
  components: {
    Navbar,
    Footer,
    Content,
    ThreeModel,
  },
  data() {
    return {
      offers: [],
      deleteMessage: "",
      prod: "",
      dev: "",
      userid: "",
      mediumid: "",
    };
  },
  methods: {
    deleteOffer(id) {
      deleteOffer(id).then((response) => {
        this.deleteMessage = response;
        console.log(this.deleteMessage);
        window.location.reload();
      });
    },
  },
  mounted() {},
  created() {
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }

    const userid = store.getters.getUserID;

    getOfferHistory(userid).then((response) => {
      this.offers = response;
      this.offers.forEach((element) => {
        element.datum_hinzugefuegt = moment(element.datum_hinzugefuegt)
          .utc()
          .add(2, "hours")
          .format("LLL");
      });
    });
  },
};
</script>

<style scoped>
h2 {
  font-size: calc(100% + 0.5vw);
}

.card:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  transform: translate(0px, -8px);
  transition: 0.6s;
}

.card {
  width: 24%;
  margin: 15px;
  box-sizing: border-box;
  float: left;
  text-align: center;
  border-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  padding-top: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: 0.4s;
}

.fa {
  color: #ff9f43;
  font-size: 26px;
  transition: 0.4s;
}
.fa:hover {
  transform: scale(1.3);
  transition: 0.6s;
}

.checked {
  color: orange;
}

h3 {
  text-align: center;
  font-size: 30px;
  margin: 0;
  padding-top: 10px;
}
h6 {
  font-size: 26px;
  text-align: center;
  color: #222f3e;
  margin: 0;
}
</style>