<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="container" v-if="this.serviceLoaded">
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">
            <u>{{ this.service.title }}</u>
          </h3>
          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-6">
              <div class="white-box text-center mx-2">
                <div
                  v-if="dev"
                  class="embed-responsive embed-responsive-4by3"
                  style="vertical-align: top; border-style: solid"
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
                  style="vertical-align: top; border-style: solid"
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
              </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6">
              <h4 class="box-title">
                User:
                <router-link
                  :to="{ path: '/user', query: { id: service.user_id } }"
                  >{{ this.service.username }}
                </router-link>
              </h4>
              <!--Weiterleitung zum Chat-->
              <router-link
                :to="{
                  path: '/chat',
                  query: {
                    offerUser: this.service.user_id,
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
              <h4 class="box-title mt-4">Service description</h4>
              <p>
                {{ this.service.description }}
              </p>
            </div>
            <div class="row">
              <div class="col-md-7"></div>
            </div>

            <h3 class="box-title mt-5">General info</h3>
            <div class="table-responsive">
              <table class="table table-striped table-product">
                <tbody>
                  <tr>
                    <td>Category:</td>
                    <td>{{ this.service.kategorie }}</td>
                  </tr>
                  <tr>
                    <td>Tags:</td>
                    <td>{{ this.service.tags }}</td>
                  </tr>
                  <tr>
                    <td>Date of creation:</td>
                    <td>{{ this.service.datum_angebot }}</td>
                  </tr>
                </tbody>
              </table>
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
import { getService } from "../services/CreatorService";
import Navbar from "./Navbar.vue";
import store from "../store.js";
import Content from "./Content.vue";
import Footer from "./Footer.vue";
import moment from "moment";

export default {
  name: "Service",
  components: {
    Navbar,
    Content,
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
      user_id: 0,
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
    console.log(this.serviceid);
  },
  methods: {},
  mounted() {
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }

    this.userid = store.getters.getUserID;
    this.role = store.getters.getUser.rolle;

    getService(this.serviceid).then((response) => {
      this.service = response;
      this.path = response.pfad;
      this.serviceLoaded = "true";

      this.service.datum_angebot = moment(this.service.datum_angebot)
        .utc()
        .add(2, "hours")
        .format("LLL");
    });
  },
};
</script>

<style scoped>
</style>