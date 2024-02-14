<!-- 
Author: Julian Schuster und Maximilian Leitschuh
Reviewd by: Jörg Adelhelm 
 -->

<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="text-center" v-if="downloads.length > 0">
      <div
        class="text-center"
        style="
          margin-right: 50px;
          margin-left: 50px;
          margin-bottom: 20px;
          margin-top: 20px;
        "
      >
        <h3><u>My Downloads</u></h3>
        <div class="row" v-for="i in Math.ceil(downloads.length / 4)" :key="i">
          <div
            class="col-md-3"
            v-for="download in downloads.slice((i - 1) * 4, i * 4)"
            :key="download.item_id"
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
                      v-if="download.dateityp === 'image'"
                      :src="require('@/assets/files/' + download.pfad)"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="download.dateityp === 'audio'"
                      :src="require('@/assets/audio_placeholder.png')"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="download.dateityp === 'video'"
                      :src="require('@/assets/files/' + download.thumbnailpfad)"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <div
                      class="card-img-top embed-responsive-item"
                      v-if="download.dateityp === 'glb'"
                      id="modelDiv"
                    >
                      <ThreeModel :path="download.pfad" />
                    </div>
                  </div>
                  <div
                    v-if="prod"
                    class="embed-responsive embed-responsive-4by3"
                    style="vertical-align: top"
                  >
                    <img
                      v-if="download.dateityp === 'image'"
                      :src="
                        'https://teamprojektstorage.blob.core.windows.net/files/' +
                        download.pfad
                      "
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="download.dateityp === 'audio'"
                      :src="require('@/assets/audio_placeholder.png')"
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <img
                      v-if="download.dateityp === 'video'"
                      :src="
                        'https://teamprojektstorage.blob.core.windows.net/files/' +
                        download.thumbnailpfad
                      "
                      alt="Card image cap"
                      class="card-img-top embed-responsive-item"
                    />
                    <div
                      class="card-img-top embed-responsive-item"
                      v-if="download.dateityp === 'glb'"
                      id="modelDiv"
                    >
                      <ThreeModel
                        :path="
                          'https://teamprojektstorage.blob.core.windows.net/files/' +
                          download.pfad
                        "
                      />
                    </div>
                  </div>
                  <h2 style="font-size: calc(100% + 0.5vw)">
                    <u>{{ download.name }}</u>
                  </h2>
                  <p class="title"><b>Name:</b> {{ download.dateiname }}</p>
                  <p class="title"><b>File-type:</b> {{ download.dateityp }}</p>
                  <!-- <p class="title"><b>Price:</b> {{ download.preis }}€</p> -->
                  <!-- <p class="title"><b>User:</b> {{ download.username }}</p>
                  <p class="title"><b>Type:</b> {{ download.dateityp }}</p> -->
                </div>

                <button class="buy-1 mt-auto">
                  <!-- 
                Author: Jörg Adelhelm - Peer Review
                Hier ist ein Warning in der Console, das komplette 
                @click="downloadAngebot" kann rausgelöscht werden. 
                (Hier werden Fehler geworfen)-->
                  <a
                    style="color: white"
                    v-if="prod && download.dateityp != 'glb'"
                    :href="
                      'https://teamprojektstorage.blob.core.windows.net/files/' +
                      download.pfad
                    "
                    target="_blank"
                    :download="download.pfad.split('/')[1]"
                    >Download</a
                  >

                  <a
                    style="color: white"
                    v-if="dev && download.dateityp != 'glb'"
                    :href="require('@/assets/files/' + download.pfad)"
                    target="_blank"
                    :download="download.pfad.split('/')[1]"
                    >Download</a
                  >

                  <a
                    style="color: white"
                    v-if="prod && download.dateityp == 'glb'"
                    :href="
                      'https://teamprojektstorage.blob.core.windows.net/files/' +
                      download.pfad
                    "
                    target="_blank"
                    :download="download.pfad.split('/')[1]"
                    >Download</a
                  >

                  <a
                    style="color: white"
                    v-if="dev && download.dateityp == 'glb'"
                    :href="download.pfad"
                    target="_blank"
                    :download="download.pfad.split('/')[1]"
                    >Download</a
                  >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-else>
      <h3><u>My Downloads</u></h3>
      <Content />
    </div>
    <Footer />
  </div>
</template>

<script>
import { getDownloadHistory } from "../services/AngebotService";
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
import Content from "./Content.vue";
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
      downloads: [],
      prod: "",
      dev: "",
      userid: "",
    };
  },
  methods: {},
  mounted() {},
  created() {
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }

    const userid = store.getters.getUserID;

    getDownloadHistory(userid).then((response) => {
      this.downloads = response;
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
</style>