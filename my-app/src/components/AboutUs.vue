<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="row">
      <div class="column">
        <div class="card">
          <img
            src="../assets/ImageMaximilian.png"
            alt="Maxi"
            style="width: 100%"
          />
          <div class="container">
            <h2>Maxi Leitschuh</h2>
            <router-link to="/AboutMaximilian">
              <p><button class="button">More Information</button></p>
            </router-link>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <img src="../assets/ImageJoerg.png" alt="Jörg" style="width: 100%" />
          <div class="container">
            <h2>Jörg Adelhelm</h2>
            <router-link to="/AboutJoerg">
              <p><button class="button">More Information</button></p>
            </router-link>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="card">
          <img
            src="../assets/ImageNiklas.png"
            alt="Niklas"
            style="width: 100%"
          />
          <div class="container">
            <h2>Niklas Kümmel</h2>
            <router-link to="/AboutNiklas">
              <p><button class="button">More Information</button></p>
            </router-link>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="card">
          <img
            src="../assets/ImageJulian.png"
            alt="Julian"
            style="width: 100%"
          />
          <div class="container">
            <h2>Julian Schuster</h2>
            <router-link to="/AboutJulian">
              <p><button class="button">More Information</button></p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";

export default {
  name: "Dashboard",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {

    };
  },
  methods: {
    
  },
  mounted() {

  },
};
</script>

<style scoped>
body {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
}

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

.column {
  float: left;
  width: 25%;
  margin-bottom: 16px;
  padding: 0 8px;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin: 8px;
}

.about-section {
  padding: 10px;
  text-align: center;
  background-color: #474e5d;
  color: white;
}

.container {
  padding: 0 16px;
}

.container::after,
.row::after {
  content: "";
  clear: both;
  display: table;
}

.title {
  color: grey;
}

.button {
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
}

.button:hover {
  background-color: #555;
}

@media screen and (max-width: 650px) {
  .column {
    width: 100%;
    display: block;
  }
}
</style>

