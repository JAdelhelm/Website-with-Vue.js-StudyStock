<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div class="container-fluid bg-1 text-center">
      <h3 class="margin">Niklas Kümmel</h3>
      <img
        src="../assets/ImageNiklas.png"
        class="img-responsive img-circle margin"
        style="display: inline; border-style: solid"
        alt="placeholder"
        width="250"
        height="250"
      />
    </div>



    <div class="container-fluid bg-3 text-center">
      <div class="row">
        <div class="col-sm-12">
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
  name: "AboutNiklas",
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
.margin {
  margin-bottom: 45px;
}
.bg-1 {
  background-color: #4cc677;
  color: #ffffff;
}
.bg-2 {
  background-color: #ffffff;
  color: #000000;
}
.bg-3 {
  background-color: #555555;
  color: #ffffff;
}

.container-fluid {
  padding-top: 50px;
  padding-bottom: 50px;
}
</style>
