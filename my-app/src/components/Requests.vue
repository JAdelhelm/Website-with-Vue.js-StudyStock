<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="text-center" v-if="requests.length > 0">
      <div
        class="text-center"
        style="
          margin-right: 50px;
          margin-left: 50px;
          margin-bottom: 20px;
          margin-top: 20px;
        "
      >
        <h2><u>My Requests</u></h2>
        <br />
        <div v-for="request in requests" :key="request.id">
          <div>
            <h4>
            User '<router-link
              :to="{ path: '/user', query: { id: request.user_id } }"
              >{{ request.anfragename }}</router-link
            >' wants access to your offer: '<router-link
              :to="{ path: '/offer', query: { id: request.angebot_id } }"
              >{{ request.angebotname }}</router-link
            >'
            </h4>
            <br />
            <button type="button"
              class="btn btn-success btn-lg"
              @click="acceptRequest(request.user_id, request.angebot_id)"
            >
              Accept
            </button>
            <div class="divider2"></div>
            <button type="button"
              class="btn btn-danger btn-lg"
              @click="declineRequest(request.user_id, request.angebot_id)"
            >
              Decline
            </button>
            <br />
            <br />
          </div>
          <hr />
        </div>
      </div>
    </div>
    <div class="text-center" v-else>
      <h2><u>My Requests</u></h2>
      <Content />
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
import Content from "./Content.vue";
import {
  getRequests,
  declineRequest,
  acceptRequest,
} from "../services/RequestService";
import store from "../store.js";

export default {
  name: "Requests",
  components: {
    Navbar,
    Footer,
    Content,
  },
  data() {
    return {
      requests: [],

      prod: "",
      dev: "",
      userid: "",
    };
  },
  methods: {
    acceptRequest(userid, angebotid) {
      acceptRequest(userid, angebotid).then((response) => {
        console.log(response);
        window.location.reload();
      });
    },
    declineRequest(userid, angebotid) {
      declineRequest(userid, angebotid).then((response) => {
        console.log(response);
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

    const username = store.getters.getUser.name;

    getRequests(username).then((response) => {
      this.requests = response;
      console.log(this.requests);
    });
  },
};
</script>

<style scoped>
    .divider {
    width: 5px;
    height: auto;
    display: inline-block;
  }
</style>