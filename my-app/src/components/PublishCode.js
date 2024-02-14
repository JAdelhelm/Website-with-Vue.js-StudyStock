import { publishFile } from "../services/AngebotService";
import {
  getMedium,
  getAllTags,
  imageTagging,
  getPricesOfTags,
} from "../services/TaggingService";
import Navbar from "./Navbar.vue";
import store from "../store.js";
import Footer from "./Footer.vue";
import ThreeModel from "./ThreeModel.vue";
import { Plotly } from "vue-plotly";

export default {
  name: "Publish",
  components: {
    Navbar,
    Footer,
    ThreeModel,
    Plotly,
  },
  data() {
    return {
      data: [
        {
          // Anzahl wie oft
          values: [],
          // Tags
          labels: [],
          type: "pie",
          textinfo: "label+percent",
          textposition: "outside",
          automargin: true,
        },
      ],
      layout: {
        title: "Summary of top five tags",
        showlegend: true,
      },
      data2: [
        {
          x: [],
          y: [],
          type: "bar",
          textinfo: "label+percent",
          // textposition: "outside",

          automargin: true,
          marker: {
            color: '#028F41',
            line: {
                width: 2.5
            }
        }
        },
      ],
      layout2: {
        title: "Images with your Tag",
        showlegend: false,
        xaxis: {title:"Name"},
        yaxis: {title:"Price"},
      },
      image: document.getElementById("MLIMAGE"),
      imgsize: "w-50",
      query: "",
      itemid: "",
      username: "",
      userid: "",
      price: 0,
      license: "",
      category: "",
      name: "",
      tags: [],
      prod: "",
      dev: "",
      msg: "",
      msg2: "",
      MLTags: "",
      tagsforQ: [],
      dashboardBoolPie: true,
      dashboardBoolLine: false,
      predictionProb: "",
      description: "",
      offer: [],
      name2: "Start Tagging",
      styleDownload: {
        background: "#028f41",
        width: "310px",
        height: "90px",
      },
      closeBtn: {
        opacity: 0,
      },
      btnDownload: {
        width: "100%",
      },
      done: {},
      messages: [
        "<i class='fa-regular fa-image'></i>We will tag the image for you",
        "<i class='fa-solid fa-atom'></i>We use Machine Learning to tag your image",
        "<i class='fa-regular fa-hourglass'></i>Thanks for your patience",
      ],
      status: "",
      loadedModel: "",
      predictedTag: "",
    };
  },

  async created() {
    if (!store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const query = urlParams.get("id");

    getMedium(query).then((response) => {
      this.offer = response;
    });

    this.username = store.getters.getUser.name;
    this.userid = store.getters.getUserID;
    this.itemid = query;
  },
  methods: {
    // Prüfung, ob immer nur ein Plot aktiv ist.
    dashboardBoolSetterPie() {
      if (this.dashboardBoolPie != true) {
        this.dashboardBoolLine = false;
        this.dashboardBoolPie = true;
      } else {
        this.dashboardBoolPie = false;
      }
    },
    dashboardBoolSetterLine() {
      if (this.dashboardBoolLine != true) {
        this.dashboardBoolPie = false;
        // Hier wird die Funktion ausgeführt, welche die Tags
        // aus dem Input-Field rausholt.
        this.averagePriceTags();
        this.dashboardBoolLine = true;
      } else {
        this.dashboardBoolLine = false;
      }
    },

    async averagePriceTags() {
      // Hier kommt der Code für den zweiten Plot rein, Tags werden gesplittet
      // Wird erst getriggert, wenn auf den Button geklickt wird.
      // let tagsFrontend = this.MLTags
      // Array zu lowerCase machen
      let tagsFrontend = this.MLTags.split(",");
      // console.log(tagsFrontend);
      const nameArray = [];
      const preisArray = [];
      // Tags in ein Array laden
      try {
        let tagsArray = this.MLTags.split(",");
        // Nun aus dem Backend die entsprechenden Tags prüfen,
        // Dazu wird der Name, Preis und Tag von jedem Item benötigt.
        let objPricesTags = getPricesOfTags(tagsArray);
        // Objekt wird jetzt durchlaufen
        // Dabei werden die Namen und Preise rausgeschrieben, welche
        // Den Tag enthalten.
        objPricesTags.then(function (result) {
          // Greift auf die Parameter des Objekts zu
          let pruef_funktion = function (e) {
            // Zugriff auf Tags, des aktuellen Objekts
            let tempTags = e.tags.replaceAll(",", "");
            // Einzelne Inhalte in String umwandeln und dann mit
            // includes prüfen ob es vorkommt
            for (let i = 0; i < tagsFrontend.length; i++) {
              // console.log(tagsFrontend[i])
              let tempTagCheck = tagsFrontend[i].toString();
              tempTagCheck = tempTagCheck.replace(" ", "");
              tempTagCheck = tempTagCheck.toLowerCase();
              tempTags = tempTags.toLowerCase();
              // console.log(tempTagCheck, tempTags)
              if (tempTags.includes(tempTagCheck) && tempTagCheck != "") {
                // console.log("MATCH")
                // Diese Parameter werden dann für den Plot reingeschrieben
                // console.log(e.name, e.preis)
                nameArray.push(e.name);
                preisArray.push(e.preis);
              }
            }
          };
          // Ergebnis: 1 Array Namen / 1 Array Preise
          // Das Array wird einer Funktion übergeben.
          result.forEach(pruef_funktion);
          // console.log(nameArray)
          // console.log(preisArray)

        });
      } catch {
        console.log("No Tags");
      }
      

      this.data2[0].x = nameArray;
      this.data2[0].y = preisArray;

    },

    async tagSummary() {
      const data = await getAllTags();
      // Vorverarbeiten, damit das Sorting richtig funktioniert
      let arrTags = data.tags.split(",");
      arrTags = arrTags.map((element) => {
        return element.trim().toLowerCase();
      });
      arrTags.sort();

      const strFrequency = function (stringArr) {
        return stringArr.reduce((count, word) => {
          count[word] = (count[word] || 0) + 1;
          return count;
        }, {});
      };

      let wordObject = strFrequency(arrTags);

      const sortObjectbyValue = function (obj = {}, asc = true) {
        const ret = {};
        Object.keys(obj)
          .sort((a, b) => obj[asc ? a : b] - obj[asc ? b : a])
          .forEach((s) => (ret[s] = obj[s]));
        return ret;
      };

      let sortedWords = sortObjectbyValue(wordObject);

      const labels = Object.keys(sortedWords);
      const values = Object.values(sortedWords);

      //  Top 5 Tags
      // console.log(this.data2[0].x)
      // console.log(this.data2[0].y)
      this.data[0].labels = labels.slice(labels.length - 5, labels.length);
      this.data[0].values = values.slice(values.length - 5, values.length);
    },
    manipulateImage(size) {
      this.imgsize = size;
    },
    async startML() {
      imageTagging(this.offer.pfad).then((response) => {
        // console.log(response);
        this.MLTags = response;
      });
    },

    // Hier wird überprüft ob alles ausgefüllt ist.
    publishFile() {
      // Prüfen, ob alle Felder ausgefüllt wurden.
      if (
        this.itemid.length > 0 &&
        this.username.length > 0 &&
        this.name.length > 0 &&
        this.description.length > 0 &&
        this.category.length > 0 &&
        this.MLTags.length > 0 &&
        this.price >= 0 &&
        this.license.length > 0
      ) {
        if (
          (this.price > 0 && this.license == "For Free") ||
          (this.price == 0 && this.license == "For Sale")
        ) {
          this.msg2 = "Please select an allowed license.";
          window.scrollTo(0, top);
        } else {
          publishFile(
            this.itemid,
            this.username,
            this.name,
            this.description,
            this.category,
            this.MLTags,
            this.price,
            this.license
          ).then((response) => {
            console.log(response);
            this.$router.push({ path: "uploads" });
          });
        }
      } else {
        console.log("Please fill out all fields.");
        this.msg = "Please fill out all fields.";
        // Überprüfen, ob alle Bedingungen erfüllt sind (Loggen).
        console.log(
          `ItemID: ${this.itemid.length > 0}, ${this.itemid}`,
          "Username:" + this.username.length > 0,
          this.username,
          "Name:" + this.name.length > 0,
          this.name,
          "Description:" + this.description.length > 0,
          this.description,
          "Category:" + this.category.length > 0,
          this.category,
          "Tags:" + this.MLTags.length > 0,
          this.MLTags,
          "Price:" + this.price >= 0,
          this.price,
          "License:" + this.license.length > 0,
          "Image:" + this.image
        );
      }
    },

    //
    licenseHandler(selected) {
      switch (selected) {
        case 1:
          this.license = "For Free";
          break;
        case 2:
          this.license = "For Sale";
          break;
        case 3:
          this.license = "Hochschule Fulda only";
          break;

        default:
          break;
      }
      console.log(this.license);
    },
    categoryHandler(selected) {
      switch (selected) {
        case 1:
          this.category = "Education";
          break;
        case 2:
          this.category = "Leisure";
          break;
        case 3:
          this.category = "Culture";
          break;

        default:
          break;
      }
    },
    // Button handling - Tagging
    tagging() {
      var interval = setInterval(() => {
        this.status =
          this.messages[Math.floor(Math.random() * this.messages.length)];
      }, 1500);

      setTimeout(() => {
        clearInterval(interval);
        this.status = "<i class='fas fa-check'></i>Tagging finished!";
        (this.styleDownload = {
          background: "#028f41",
          width: "100%",
          height: "238px",
        }),
          (this.done = {
            color: "#fff",
            opacity: 1,
            transform: "translate(-50%,-50%)",
            transition: "all 0.3s 0s",
          }),
          //  Hier wird der ML Algorithmus gestartet
          this.startML();

        this.closeBtn = {
          opacity: 1,
          visibility: "visible",
          color: "#fff",
        };
      }, 8000),
        (this.styleDownload = {
          background: "#FDFEFE",
          width: "100%",
          height: "238px",
        }),
        (this.btnDownload = {
          background: "#028f41",
          transform: "translateY(113px)",
          transition: "transform 0.4s 0.3s, width 0.4s 0.3s, padding 0.4s 0.2s",
          width: "5%",
          paddingTop: "5px",
          paddingBottom: "5px",
          cursor: "default",
          animation: "loading 2s 1.0s forwards",
        }),
        (this.done = {
          opacity: 1,
          transform: "translate(-50%,-50%)",
        }),
        (this.name2 = "");
    },

    close() {
      (this.status = ""),
        (this.styleDownload = {
          transition: "all 0.5s 0.1s",
          background: "#028f41",
          width: "155px",
          height: "45px",
        }),
        (this.closeBtn = {
          opacity: 0,
        }),
        (this.btnDownload = {
          width: "100%",
          transform: "translateY(0px)",
          transition: "transform 0.3s 0s",
        }),
        (this.done = {
          opacity: 0,
          transition: "all 0.1s 0s",
        });
      this.name2 = "Tag again";
    },
  },
  mounted() {
    this.tagSummary();
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }
  },
};
