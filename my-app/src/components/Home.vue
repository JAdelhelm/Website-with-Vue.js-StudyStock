<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <FilterBar />
    <div class="text-center" v-if="offers.length > 0 || services.length > 0">
      <div
        class="text-center"
        style="
          margin-right: 50px;
          margin-left: 50px;
          margin-bottom: 20px;
          margin-top: 20px;
        "
      >
        <h3 class="mt-3 mb-2" v-if="offers.length > 0" style="text-align: left">
          Offers:
        </h3>
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
                      :src="
                        offer.lizenz == 'For Free'
                          ? require('@/assets/files/' + offer.pfad)
                          : require('@/assets/files/' + offer.thumbnailpfad)
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
                        offer.lizenz == 'For Free'
                          ? 'https://teamprojektstorage.blob.core.windows.net/files/' +
                            offer.pfad
                          : 'https://teamprojektstorage.blob.core.windows.net/files/' +
                            offer.thumbnailpfad
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
                  <h3 style="font-size: calc(100% + 0.5vw)">
                    {{ offer.name }}
                  </h3>
                  <p>{{ shortenWord(offer.description) }}</p>
                  <h6>{{ offer.preis }}€</h6>

                  <!-- Hier das Rating einfügen -->
                  <p>
                    <!-- Hier das Rating einfügen -->

                    <!-- Rating eingefügt, welches den aktuellen Wert anzeigt -->
                    <!-- Einmal span separiert, da es sonst einne Error schmeißt -->
                    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->

                    <span>
                      <span
                        class="fa fa-star checked"
                        v-for="index in parseInt(Math.round(offer.avg_rating))"
                        :key="index"
                      ></span>
                    </span>
                    <span
                      class="fa fa-star"
                      v-for="index2 in parseInt(5 - offer.avg_rating)"
                      :key="index2"
                    ></span>
                  </p>

                  <!--  -->
                </div>
                <!--Button, um auf Detailansicht des Angebots zu kommen-->
                <router-link :to="{ path: '/offer', query: { id: offer.id } }">
                  <button class="buy-1 mt-auto">More</button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <!-- Hier Services darstellen -->
        <h3
          class="mt-3 mb-2"
          v-if="services.length > 0"
          style="text-align: left"
        >
          Services:
        </h3>
        <div class="row" v-for="k in Math.ceil(services.length / 4)" :key="k">
          <div
            class="col-md-3"
            v-for="service in services.slice((k - 1) * 4, k * 4)"
            :key="service.id"
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
                      :src="require('@/assets/files/' + service.pfad)"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                  </div>
                  <div
                    v-if="prod"
                    class="embed-responsive embed-responsive-4by3"
                    style="vertical-align: top"
                  >
                    <img
                      :src="
                        'https://teamprojektstorage.blob.core.windows.net/files/' +
                        service.pfad
                      "
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                  </div>
                  <h2>
                    <u>{{ service.name }}</u>
                  </h2>
                  <p class="title">
                    <b>Service Provider:</b> {{ service.username }}
                  </p>
                  <p class="title"><b>Date:</b> {{ service.datum_angebot }}</p>
                </div>
                <router-link
                  :to="{ path: '/service', query: { id: service.id } }"
                >
                  <button style="" class="buy-1 mt-auto">More</button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-else>
      <Content />
    </div>
    <Footer />
  </div>
</template>

<script>
import { getAngebote } from "../services/AngebotService";
import { getServices } from "../services/CreatorService";
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
import FilterBar from "./FilterBar.vue";
import Content from "./Content.vue";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import ThreeModel from "./ThreeModel.vue";
import moment from "moment";

export default {
  name: "Home",
  components: {
    Navbar,
    Content,
    Footer,
    FilterBar,
    ThreeModel,
  },
  data() {
    return {
      offers: [],
      services: [],
      query: "",
      prod: "",
      dev: "",
      userid: "",
    };
  },
  methods: {
    shortenWord(name) {
      let str = name;
      let fill = "(...)";
      if (str.length > 75) {
        str = str.substring(0, 75);
        str = str + fill;
      }
      return str;
    },
  },
  mounted() {
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }

    getAngebote(this.query, "Latest", "All", "All").then((responseOffers) => {
      this.offers = responseOffers;
      getServices(this.query, "All", "Latest").then((responseServices) => {
        this.services = responseServices;
        this.services.forEach((element) => {
          element.datum_angebot = moment(element.datum_angebot)
            .utc()
            .add(2, "hours")
            .format("LLL");
        });
      });
    });
  },
  created() {},
};
</script>

<style scoped>
.checked {
  color: orange;
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

.pagination .page-link {
  color: rgb(2, 143, 65);
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
p {
  text-align: center;
  color: #b2bec3;
  padding: 8px 8px;
  margin-bottom: 0;
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
button {
  text-align: center;
  font-size: 24px;
  color: #fff;
  width: 100%;
  padding: 15px;
  border: 0px;
  outline: none;
  cursor: pointer;
  margin-top: 5px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

.buy-1 {
  background-color: rgb(2, 143, 65);
}

h2 {
  font-size: calc(100% + 0.5vw);
}

button:hover {
  opacity: 0.8;
}

.card {
  height: 100%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin: 8px;
}

.card-group {
  padding-bottom: 15px;
}

.pagination .page-link {
  color: rgb(2, 143, 65);
}
</style>