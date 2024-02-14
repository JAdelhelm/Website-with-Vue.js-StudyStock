<template>
  <!-- /**
 * Author: Niklas Kümmel
 * Reviewed by: Julian Schuster
 */ -->
  <div class="d-flex flex-column min-vh-100" style="text-align: center">
    <Navbar />
    <div
      class="border"
      style="
        margin-top: 20px;
        margin-bottom: 20px;
        border: solid #ccc;
        border-width: thin thin;
        margin-right: 15%;
        margin-left: 15%;
      "
    >
      <div class="container">
        <h1><u>Upload a file</u></h1>
        <p>Please fill in this form to upload a file to your Inventory.</p>

        <p>
          NOTE: This will upload a file to your personal inventory. To publish
          an uploaded file go to "My Uploads"
        </p>

        <p>Supported types: jpg, jpeg, png, mp4, mp3, glb</p>

        <br />

        <!-- Drag&Drop: -->
        <div
          class="flex w-full h-screen items-center justify-center text-center"
        >
          <div
            class="p-12 text-center"
            id="dragdrop"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
          >
            <!-- Review Kommentar:
             accept-tag mit ".pdf,.jpg,.jpeg,.png,.mp4,.mp3" stimmt nicht mit all den erlaubten Dateien überein. Dies sollte angepasst werden 
             Korrigiert von Niklas Kuemmel!
             -->
            <input
              type="file"
              name="fields[assetsFieldHandle][]"
              id="assetsFieldHandle"
              class="w-px h-px opacity-0 overflow-hidden absolute"
              @change="uploadFile"
              ref="file"
              accept=".pdf,.jpg,.jpeg,.png,.mp4,.mp3,.glb,.gif,.bmp,.svg,.xml,.webm,.wav,.mpeg,.ogg,.opus,.acc"
            />

            <label for="assetsFieldHandle" class="block cursor-pointer">
              <div style="cursor: pointer">
                Choose a file or
                <span style="text-decoration: underline">click here</span> to
                upload their files
              </div>
            </label>
            <ul
              class="mt-2"
              v-if="this.filelist.length"
              v-cloak
              id="fileUpload"
            >
              <!-- Review Kommentar: 
              1. :key="file" ist nicht in data() definiert, auch in der Konsole wird diesbezüglich eine Warnung geworfen, sobald ein File wieder entfernt wird.
              2. :key="file.id" ist besser, da man besser ein string/number value als key nimmt. Auch dies entfernt eine Vue Warnung sobald man etwas reinzieht.
              3. Der Benutzer darf nur ein File hochladen, hat aber die möglichkeit mehrere Dateien per Drag & Drop reinzuziehen. Hier sollte man das hereinziehen mehrerer Files unterbinden.
              -->
              <li class="text-sm p-1" v-for="file in filelist" :key="file.id">
                {{ shortenWord(file.name) }}
              </li>
            </ul>
            <button
              class="ml-2 btn btn-danger"
              type="button"
              @click="remove(filelist.indexOf(file))"
              title="Remove file"
              v-if="this.filelist.length"
              v-cloak
            >
              remove
            </button>
          </div>
          <button type="submit" @click.prevent="submitFile" class="uploadbtn">
            Upload!
          </button>
          <b v-if="msg">{{ msg }}</b>
          <div
            class="spinner-border text-primary"
            role="status"
            v-if="!msg && uploading"
          >
            <span class="sr-only">Loading...</span>
          </div>

          <!-- Für Create Service: -->
          <div>
            <p style="margin-top: 10px">
              Or do you want to create a new Service instead?
            </p>
            <router-link :to="{ path: '/newService' }">
              <button class="uploadbtn">Create new service!</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { submitFile } from "../services/AngebotService";
import Navbar from "./Navbar.vue";
import store from "../store.js";
import Footer from "./Footer.vue";

export default {
  name: "Upload",
  components: {
    Navbar,
    Footer,
  },

  delimiters: ["${", "}"],

  /*
   * Review Kommentar:
   * 1. In data() gibt es eine Variablen die nie genutzt werden (query, images, kategorie, tags, nameItem).
   * 2. file:"" sollte hinzugefügt werden, da sie verwendet wird aber nicht definiert ist
   * Korrigiert von Niklas Kuemmel!
   */
  data() {
    return {
      upload: null,
      name: "",
      prod: "",
      dev: "",
      msg: "",
      file: "",
      uploading: "",
      filelist: [],
    };
  },
  async created() {
    if (!store.getters.isLoggedIn) {
      this.$router.push("/login");
    }
    this.username = store.getters.getUser.name;
    this.userid = store.getters.getUserID;
  },
  methods: {
    shortenWord(name) {
      let str = name;
      let ending = "";
      let fill = "(...)";
      for (let i = 0; i < str.length - 1; i++) {
        if (str.charAt(i) == ".") {
          ending = str.substring(i, str.length);
        }
      }

      if (str.length > 20) {
        str = str.substring(0, 15);
        str = str + fill + ending;
      }
      //console.log("Der neue String ist: " + str);
      return str;
    },
    remove(i) {
      this.filelist.splice(i, 1);
    },
    dragover(event) {
      event.preventDefault();
      // Add some visual fluff to show the user can drop its files
      if (event.currentTarget.classList.contains("p-12 text-center")) {
        event.currentTarget.classList.remove("bg-gray-100");
        event.currentTarget.classList.add("bg-green-300");
      }
    },
    dragleave(event) {
      // Clean up
      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-green-300");
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.uploadFile(); // Trigger the uploadFile event manually
      // Clean up
      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-green-300");
    },
    /*
     * Review Kommentar:
     * this.filelist speichert alle hochgeladenen files, aber nur eins sollte erlaubt sein.
     */
    uploadFile() {
      this.filelist = [...this.$refs.file.files];
      this.upload = this.$refs.file.files[0];
    },
    submitFile() {
      if (this.upload == null) {
        this.msg = "Please choose a file before clicking 'Upload!'";
      } else {
        this.uploading = "true";
        this.msg = "";
        submitFile(this.username, this.userid, this.upload).then((res) => {
          console.log(res);
          this.msg = res.msg;
          this.uploading = "";
          this.upload = null;
          this.remove(this.filelist.indexOf(this.upload));
        });
      }
    },
  },
  mounted() {
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }
  },
};
</script>

<style scoped>
.container {
  padding: 16px;
}

/* Full-width input fields */
input[type="text"] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

input[type="text"]:focus {
  background-color: #ddd;
  outline: none;
}

/* Set a style for the submit/register button */
.uploadbtn {
  background-color: rgb(2, 143, 65);
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

.uploadbtn:hover {
  opacity: 1;
}

#dragdrop {
  border-style: dashed;
  border-width: thin;
  height: 180px;
}

[v-cloak] {
  display: none;
}

#assetsFieldHandle {
  display: none;
  align-items: center;
  justify-content: center;
}

#fileUpload {
  list-style-type: none;
}
</style>