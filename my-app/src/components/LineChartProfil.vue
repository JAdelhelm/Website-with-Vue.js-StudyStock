<template>
  <div>
    <!-- creation of the line-chart with the respective attributes(props) -->
    <LineChartGenerator
      v-if="loaded"
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
      style="max-height: 300px"
    />
  </div>
</template>

<script>
// import of the required chart-js objects and the middleware
import { Line as LineChartGenerator } from "vue-chartjs/legacy";
import store from "../store";
import { getDownloadChart } from "../services/ChartService";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// registration of the chart-js objects
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  name: "LineChart",
  components: { LineChartGenerator },
  //determination of the props
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Object,
      default: () => {
        Title;
      },
    },
  },
  data: () => {
    return {
      chartData: null,
      chartOptions: null,
      loaded: false,
      downloads: [],
      userid: "",
    };
  },
  async mounted() {
    const userid = store.getters.getUserID;
    try {
      // get data for the chart
      getDownloadChart(userid).then((response) => {
        // data is saved in this.downloads
        this.downloads = response;
        console.log(this.downloads);
        // labels are saved in a variable with the map function
        var labels = this.downloads.map(function (e) {
          return e.Datum;
        });
        console.log(labels);
        // data is saved in a variable with the map function
        var data = this.downloads.map(function (e) {
          return e.AnzahlDownloads;
        });
        // creation of the chart-data with the assignment of labels, data and colors
        (this.chartData = {
          labels: labels,
          datasets: [
            {
              data: data,
              borderColor: ["rgba(255, 99, 132, 1)"],
              label: "Downloads",
            },
          ],
        }),
          (this.chartOptions = {
            //set responsiveness
            responsive: true,
            maintainAspectRatio: false,
            //defining the scales of the chart
            scales: {
              y: {
                // defining min and max so hiding the dataset does not change scale range
                beginAtZero: true,
                max: 10,
                ticks: {
                  stepSize: 2,
                },
              },
            },
          });

        this.loaded = true;
      });
    } catch (e) {
      console.error(e);
    }
  },
};
</script>

<style scoped>
LineChartGenerator {
  max-height: 50px;
}
</style>