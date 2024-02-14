<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <div
      class="text-center"
      style="
        margin-right: 50px;
        margin-left: 50px;
        margin-bottom: 20px;
        margin-top: 20px;
      "
    >
      <h3 style="text-align: center"><u>Statistics</u></h3>
      <button class="button" @click="exportToPDF(0)">
        {{ download_status }}
      </button>
      <div id="barchart" class="container">
        <h4 style="text-align: center">Number of my downloads over time:</h4>
        <BarChart />
      </div>
      <div id="barchart3" class="container">
        <h4 style="text-align: center">Number of downloads of my offers:</h4>
        <BarChart3 />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
import BarChart from "./LineChartProfil.vue";
import BarChart3 from "./BarChartProfil.vue";
import Exporter from "vue-chartjs-exporter";


export default {
  name: "Benutzer",
  components: {
    Navbar,
    Footer,
    BarChart,
    BarChart3
  },
  data() {
    return {
      download_status: "Download Charts",
    };
  },
  methods: {
    exportToPDF() {
      this.download_status = "Processing...";
      let barchart = document.getElementById("barchart");
      let barchart3 = document.getElementById("barchart3");
      const exp = new Exporter([barchart, barchart3]);
      exp.export_pdf().then((pdf) => {
        pdf.save("charts.pdf");
        this.download_status = "Download Charts";
      });
    },
  },
  mounted() {},
  created() {},
};
</script>

<style scoped>
.button {
  background: lightblue;
  border: none;
  border-radius: 20px;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  transition: ease 300ms;
  outline: none;
}
.button:hover {
  background: darkcyan;
  transition: ease 300ms;
}
</style>

