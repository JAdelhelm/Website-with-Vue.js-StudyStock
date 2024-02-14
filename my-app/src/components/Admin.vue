<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="text-center" v-if="pendingOffers.length > 0">
      <div
        class="text-center"
        style="
          margin-right: 50px;
          margin-left: 50px;
          margin-bottom: 20px;
          margin-top: 20px;
        "
      >
        <h3><u>Incoming Offers</u></h3>
        <div
          class="row"
          v-for="i in Math.ceil(pendingOffers.length / 4)"
          :key="i"
        >
          <div
            class="col-md-3"
            v-for="pendingOffer in pendingOffers.slice((i - 1) * 4, i * 4)"
            :key="pendingOffer.id"
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
                      v-if="pendingOffer.dateityp === 'image'"
                      :src="require('@/assets/files/' + pendingOffer.pfad)"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="pendingOffer.dateityp === 'audio'"
                      :src="require('@/assets/audio_placeholder.png')"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="pendingOffer.dateityp === 'video'"
                      :src="
                        require('@/assets/files/' + pendingOffer.thumbnailpfad)
                      "
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <div
                      class="card-img-top embed-responsive-item"
                      v-if="pendingOffer.dateityp === 'glb'"
                      id="modelDiv"
                    >
                      <ThreeModel :path="pendingOffer.pfad" />
                    </div>
                  </div>
                  <div
                    v-if="prod"
                    class="embed-responsive embed-responsive-4by3"
                    style="vertical-align: top"
                  >
                    <img
                      v-if="pendingOffer.dateityp === 'image'"
                      :src="
                        'https://teamprojektstorage.blob.core.windows.net/files/' +
                        pendingOffer.pfad
                      "
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="pendingOffer.dateityp === 'audio'"
                      :src="require('@/assets/audio_placeholder.png')"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="pendingOffer.dateityp === 'video'"
                      :src="
                        'https://teamprojektstorage.blob.core.windows.net/files/' +
                        pendingOffer.thumbnailpfad
                      "
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <div
                      class="card-img-top embed-responsive-item"
                      v-if="pendingOffer.dateityp === 'glb'"
                      id="modelDiv"
                    >
                      <ThreeModel
                        :path="
                          'https://teamprojektstorage.blob.core.windows.net/files/' +
                          pendingOffer.pfad
                        "
                      />
                    </div>
                  </div>
                  <h2>
                    <u>{{ pendingOffer.name }}</u>
                  </h2>
                  <p class="title">
                    <b>Date:</b> {{ pendingOffer.datum_angebot }}
                  </p>
                  <p class="title"><b>Type:</b> {{ pendingOffer.dateityp }}</p>
                </div>
                <p>
                  <router-link
                    :to="{ path: '/offer', query: { id: pendingOffer.id } }"
                  >
                    <button
                      style="
                        background-color: black;
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
                    @click="declineOffer(pendingOffer.id)"
                    class="mt-auto"
                  >
                    Decline
                  </button>
                </p>
                <p>
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
                    @click="acceptOffer(pendingOffer.id)"
                  >
                    Accept
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-else>
      <h3><u>Incoming Offers</u></h3>
      <Content />
    </div>
    <Footer />
  </div>
</template>

<script>
import { getPendingOffers } from "../services/AngebotService";
import { acceptOffer } from "../services/AngebotService";
import { declineOffer } from "../services/AngebotService";
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
import Content from "./Content.vue";
import moment from "moment";
import store from "../store";
import ThreeModel from "./ThreeModel.vue";

export default {
  name: "Search",
  components: {
    Navbar,
    Footer,
    Content,
    ThreeModel,
  },
  data() {
    return {
      pendingOffers: [],
      acceptMessage: "",
      declineMessage: "",
      prod: "",
      dev: "",
      userid: "",
      mediumid: "",
    };
  },
  methods: {
    acceptOffer(id) {
      acceptOffer(id).then((response) => {
        this.acceptMessage = response;
        console.log(this.acceptMessage);
        window.location.reload();
      });
    },
    declineOffer(id) {
      declineOffer(id).then((response) => {
        this.declineMessage = response;
        console.log(this.declineMessage);
        window.location.reload();
      });
    },
  },
  mounted() {},
  created() {
    console.log("Hallo");
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }

    const userid = store.getters.getUserID;

    getPendingOffers(userid).then((response) => {
      this.pendingOffers = response;
      this.pendingOffers.forEach((element) => {
        element.datum_angebot = moment(element.datum_angebot)
          .utc()
          .add(2, "hours")
          .format("LLL");
      });

      console.log(this.pendingOffers);
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
</style>