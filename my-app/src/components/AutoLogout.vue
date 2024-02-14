<template>
  <div class="" v-if="warningTime" id="logoutWarning">
    <p class="mb-0">Are you still there?</p>
    <p class="mb-0">
      You will be logged out in 1 minute because of inactivity!
    </p>
  </div>
</template>

<script>
import store from "../store.js";
import socket from "../socket";

export default {
  name: "AutoLogout",

  data: function () {
    return {
      events: ["click", "mousemove", "mousedown", "scroll", "keypress", "load"],

      warningTimer: null,
      logoutTimer: null,
      warningTime: false,
      logoutActive: false,
    };
  },

  mounted() {
    this.events.forEach(function (event) {
      window.addEventListener(event, this.resetTimers);
    }, this);

    this.setTimers();
  },
  created() {
    this.logoutActive = true;
  },

  destroyed() {
    this.logoutActive = false;
    this.events.forEach(function (event) {
      window.removeEventListener(event, this.resetTimers);
    }, this);

    this.resetTimers();
  },

  methods: {
    setTimers: function () {
      if (this.logoutActive) {
        this.warningTimer = setTimeout(this.warningMessage, 1 * 60 * 1000); //Time in miliseconds, aktuell 1 Minuten
        this.logoutTimer = setTimeout(this.autoLogout, 2 * 60 * 1000); //Time in miliseconds, aktuell 2 Minuten

        this.warningTime = false;
      }
    },

    warningMessage: function () {
      //alert('Warning, you might get loged out, because of inactivity!');
      this.warningTime = true;
    },

    autoLogout: function () {
      store.dispatch("logout");
      socket.disconnect();
      this.$router.push("/login");
      console.log("You were logged out automatically");
    },

    resetTimers: function () {
      clearTimeout(this.warningTimer);
      clearTimeout(this.logoutTimer);

      this.setTimers();
    },
  },
};
</script>

<style>
#logoutWarning {
  background-color: rgb(2, 143, 65);
  color: white;
  text-align: center;
  font-size: 20px;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
