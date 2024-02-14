<template>
  <div>
    <!-- creation of the bar-chart with the respective attributes(props) -->
    <Bar
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
    />
  </div>
</template>

<script>
// import of the required chart-js objects and the middleware
import { Bar } from "vue-chartjs/legacy";
import store from "../store.js";
import { getDownloadedOffers } from "../services/ChartService";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";


// registration of the chart-js objects
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: { Bar },
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
      default: 400,
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
      colors: [],
    };
  },
  async mounted() {
    const userid = store.getters.getUserID;
    try {
      // get data for the chart
      getDownloadedOffers(userid).then((response) => {
        // data is saved in this.downloads
        this.downloads = response;
        console.log(this.downloads);
        // creation of dynamic colors for the chart
        for (let i = 0; i < this.downloads.length; i++) {
          this.colors.push(
            "#" + Math.floor(Math.random() * 16777215).toString(16)
          );
        }
        // labels are saved in a variable with the map function
        var labels = this.downloads.map(function (e) {
          return e.Medium;
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
              backgroundColor: this.colors,
              label: "Downloads",
            },
          ],
        }),
          (this.chartOptions = {
            //set responsiveness
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              title: {
                display: false,
                text: "Custom Chart Title",
              },
            },
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