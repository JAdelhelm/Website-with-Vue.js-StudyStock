<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="row">
      <div class="column1">
        <div class="container">
          <img
            src="../assets/ImageMaximilian.png"
            alt="Maxi"
            style="width: 100%"
          />
        </div>
      </div>
      <div class="column2">
        <div class="container">
          <b><h2 class="title1">Maximilian Leitschuh</h2></b>

        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

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

.column1 {
  float: left;
  width: 40%;
  margin-bottom: 16px;
  padding: 0 8px;
}

.column2 {
  float: left;
  width: 60%;
  margin-bottom: 16px;
  padding: 0 8px;
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

.title1 {
  font-size: 40px;
  color: black;
}

.title2 {
  font-size: 30px;
  color: rgb(60, 59, 59);
}

.information {
  font-size: 20px;
}

.bg-1 {
  color: #ffffff;
}
</style>

<script>
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";

export default {
  name: "AboutMaximilian",
  components: {
    Navbar,
    Footer
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