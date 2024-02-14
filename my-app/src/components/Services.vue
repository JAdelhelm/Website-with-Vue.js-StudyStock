<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="text-center" v-if="services.length > 0">
      <div
        class="text-center"
        style="
          margin-right: 50px;
          margin-left: 50px;
          margin-bottom: 20px;
          margin-top: 20px;
        "
      >
        <h3><u>My Services</u></h3>
        <div class="row" v-for="i in Math.ceil(services.length / 4)" :key="i">
          <div
            class="col-md-3"
            v-for="service in services.slice((i - 1) * 4, i * 4)"
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
                  <p class="title">
                    <b>Date:</b> {{ service.datum_angebot }}
                  </p>
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
                    @click="deleteService(service.id)"
                  >
                    Delete
                  </button>
                </p>
                <p>
                  <router-link
                    :to="{ path: '/editservice', query: { id: service.id } }"
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
                      Edit
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
      <h3><u>My Services</u></h3>
      <Content />
    </div>
    <Footer />
  </div>
</template>

<script>
import { getServiceHistory } from "../services/CreatorService";
import { deleteService } from "../services/CreatorService";
import store from "../store";
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
import Content from "./Content.vue";
import moment from "moment";

export default {
  name: "Services",
  components: {
    Navbar,
    Footer,
    Content,
  },
  data() {
    return {
      services: [],
      deleteMessage: "",
      prod: "",
      dev: "",
      userid: "",
    };
  },
  methods: {
    deleteService(id) {
      deleteService(id).then((response) => {
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

    var username = store.getters.getUser.name;

    getServiceHistory(username).then((response) => {
      this.services = response;
      console.log(response);
      this.services.forEach((element) => {
        element.datum_angebot = moment(element.datum_angebot)
          .utc()
          .add(2, "hours")
          .format("LLL");
      });

      console.log(this.services);
    });
  },
};
</script>

<style scoped>
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
</style>