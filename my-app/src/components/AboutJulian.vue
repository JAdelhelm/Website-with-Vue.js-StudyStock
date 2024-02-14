<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="container-fluid bg-1 text-center">
      <h3 class="margin">Julian Schuster</h3>
      <img
        src="../assets/ImageJulian.png"
        class="img-responsive img-circle margin"
        style="display: inline; border-style: solid"
        alt="placeholder"
        width="250"
        height="250"
      />
    </div>



    <div class="container-fluid bg-3 text-center">
      <h3 class="margin">Kontakt</h3>
      <div class="row">
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
</script>

<style scoped>
.bg-1 {
  background-color: #1e80ad;
  color: #ffffff;
}
.bg-2 {
  background-color: #474e5d;
  color: #ffffff;
}
.bg-3 {
  background-color: #ffffff;
  color: #555555;
  margin-top: 25px;
}
</style>

<script>
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";

export default {
  name: "AboutJulian",
  components: {
    Navbar,
    Footer
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>