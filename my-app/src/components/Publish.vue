<template>
  <div class="d-flex flex-column bd-highlight mb-3" style="text-align: left">
    <Navbar />

    <div
      class="border"
      style="
        margin-top: 20px;
        margin-bottom: 20px;
        border: solid #ccc;
        border-width: thin thin;
        margin-right: 5%;
        margin-left: 5%;
      "
    >
      <div class="container">
        <h1 class="display-4">Publish</h1>

        <p class="lead">Please fill out all fields to publish a file.</p>
        <div class="row">
          <div class="col">
            <label for="psw"><h4>Name</h4></label>
            <input
              type="text"
              placeholder="Name"
              v-model="name"
              style="width: 100%"
              required
            />
          </div>
          <div class="col">
            <div class="row">
              <label for="psw"><h4>Description</h4></label>
              <textarea
                class="form-control"
                rows="3"
                placeholder="Description..."
                v-model="description"
                maxlength="255"
                style="width: 100%"
              ></textarea>
            </div>
          </div>
          <div></div>
        </div>
        <div class="container"></div>
        <div class="row"></div>
        <div class="row">
          <div class="col">
            <label for="psw"><h4>Price</h4></label>
            <input type="text" placeholder="Price" v-model="price" required />
            <div class="row">
              <div class="col">
                <label for="psw"
                  ><h4>License&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4></label
                >
                <div class="btn-group" data-toggle="buttons">
                  <label
                    class="btn btn-outline-success"
                    style="margin-right: 20px"
                  >
                    <input
                      type="radio"
                      name="options"
                      id="option1"
                      @click="licenseHandler(1)"
                      style="display: none"
                    />For Free&nbsp;&nbsp;&nbsp;&nbsp;
                  </label>
                  <label
                    class="btn btn-outline-success"
                    style="margin-right: 20px"
                  >
                    <input
                      type="radio"
                      name="options"
                      id="option2"
                      @click="licenseHandler(2)"
                      style="display: none"
                    />
                    For Sale
                  </label>
                  <label class="btn btn-outline-success">
                    <input
                      type="radio"
                      name="options"
                      id="option3"
                      @click="licenseHandler(3)"
                      style="display: none"
                    />
                    HS Fulda only
                  </label>
                </div>
              </div>
            </div>

            <h4 style="color: red" v-if="this.msg2">
              {{ this.msg2 }}
              <div class="divider2"></div>
            </h4>
            <div class="container">
              <div class="row">
                <label for="psw"><h4>Category</h4></label>

                <div class="col">
                  <div class="btn-group" data-toggle="buttons">
                    <label
                      class="btn btn-outline-success"
                      style="margin-right: 20px"
                    >
                      <input
                        type="radio"
                        name="options"
                        id="option4"
                        @click="categoryHandler(1)"
                        style="display: none"
                      />
                      Education
                    </label>
                    <label
                      class="btn btn-outline-success"
                      style="margin-right: 20px"
                    >
                      <input
                        type="radio"
                        name="options"
                        id="option5"
                        @click="categoryHandler(2)"
                        style="display: none"
                      />
                      Leisure&nbsp;&nbsp;
                    </label>
                    <label
                      class="btn btn-outline-success"
                      style="margin-right: 20px"
                    >
                      <input
                        type="radio"
                        name="options"
                        id="option6"
                        @click="categoryHandler(3)"
                        style="display: none"
                      />
                      Culture
                    </label>
                  </div>
                </div>

                <div class="container">
                  <div class="row">
                    <label for="psw"><h4>Dashboard</h4></label>
                  </div>
                  <div class="row">
                    <!-- Hier Button einfügen, der das Dashboard öffnet -->
                    <!-- Create a div where the graph will take place -->
                    <!-- Hier bei v-if müssen noch entsprechend Buttons rein, so dass
              man auswählen kann zwischen den verschiedenen Plots -->
                    <button
                      @click="dashboardBoolSetterPie"
                      type="button"
                      class="btn btn-outline-info"
                    >
                      Summary of  <br>
                      top five tags
                    </button>
                    <div class="divider2"></div>
                      <button
                      @click="dashboardBoolSetterLine"
                      type="button"
                      class="btn btn-outline-info"
                    >
                      Price of offers <br>
                      with your tag
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <div class="col-sm-6">
            <div class="row">
              <div style="width: 100%; height: 100%">
                <Plotly
                  v-if="this.dashboardBoolPie == true"
                  :data="data"
                  :layout="layout"
                  :display-mode-bar="true"
                ></Plotly>
                <!-- Hier kommt der zweite Plot rein -->
                  <Plotly
                  v-if="this.dashboardBoolLine == true"
                 
                  :data="data2"
                  :layout="layout2"
                  :display-mode-bar="true"

                ></Plotly>
                <!--  -->
              </div>
            </div>
          </div>
          <div class="container">
            <label for="psw"><h4>Preview</h4></label>
            <div class="col">
              <div class="row">
                <!-- Dropdown Buttons zum manipulieren des Bildes -->
                <div class="btn-group" v-if="this.offer.dateityp === 'image'">
                  <button
                    title="Increase image size for better prediction"
                    data-placement="right"
                    type="button"
                    class="btn btn-success dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Image size
                  </button>

                  <div
                    class="dropdown-menu"
                    v-if="this.offer.dateityp === 'image'"
                  >
                    <a
                      @click.prevent="manipulateImage('w-25')"
                      class="dropdown-item"
                      >25 %</a
                    >
                    <a
                      @click.prevent="manipulateImage('w-50')"
                      class="dropdown-item"
                      >50 %</a
                    >
                    <a
                      @click.prevent="manipulateImage('w-75')"
                      class="dropdown-item"
                      >75 %</a
                    >
                    <a
                      @click.prevent="manipulateImage('w-100')"
                      class="dropdown-item"
                      >100 %</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="row">
            <div :class="imgsize">
              <!--Beim Bild Unterscheidung zwischen Prod und Development-->
              <div
                v-if="dev"
                class="embed-responsive embed-responsive-4by3"
                style="vertical-align: top; border-style: solid"
              >
                <!--Bild als Medium-->

                <!--  -->

                <img
                  id="MLIMAGE"
                  v-if="this.offer.dateityp === 'image'"
                  :src="require('@/assets/files/' + this.offer.pfad)"
                  width="50%"
                  class="card-img-top embed-responsive-item"
                  style="border-style: solid"
                  crossorigin="anonymous"
                />
                <!--Audio als Medium-->
                <img
                  v-if="this.offer.dateityp === 'audio'"
                  :src="require('@/assets/audio_placeholder.png')"
                  width="50%"
                  class="card-img-top embed-responsive-item"
                  style="border-style: solid"
                />
                <!--Video als Medium-->
                <img
                  v-if="this.offer.dateityp === 'video'"
                  :src="require('@/assets/files/' + this.offer.thumbnailpfad)"
                  width="50%"
                  class="card-img-top embed-responsive-item"
                  style="border-style: solid"
                />

                <div
                  v-if="offer.dateityp === 'glb'"
                  id="modelDiv"
                  class="card-img-top embed-responsive-item"
                  style="border-style: solid"
                >
                  <ThreeModel :path="offer.pfad" />
                </div>

                <!-- Hier der Button zum refreshen -->
                <div class="divider2"></div>

                <!--  -->
              </div>
              <!--Seite für Prod-->
              <div
                v-if="prod"
                class="embed-responsive embed-responsive-4by3"
                style="vertical-align: top; border-style: solid"
              >
                <img
                  id="MLIMAGE"
                  v-if="this.offer.dateityp === 'image'"
                  :src="
                    'https://teamprojektstorage.blob.core.windows.net/files/' +
                    this.offer.pfad
                  "
                  width="50%"
                  class="card-img-top embed-responsive-item"
                  style="border-style: solid"
                  crossorigin="anonymous"
                />
                <img
                  v-if="this.offer.dateityp === 'audio'"
                  :src="require('@/assets/audio_placeholder.png')"
                  width="50%"
                  class="card-img-top embed-responsive-item"
                  style="border-style: solid"
                />
                <img
                  v-if="this.offer.dateityp === 'video'"
                  :src="
                    'https://teamprojektstorage.blob.core.windows.net/files/' +
                    this.offer.thumbnailpfad
                  "
                  width="50%"
                  class="card-img-top embed-responsive-item"
                  style="border-style: solid"
                />
                <div
                  class="card-img-top embed-responsive-item"
                  v-if="offer.dateityp === 'glb'"
                  id="modelDiv"
                  style="border-style: solid"
                >
                  <ThreeModel
                    :path="
                      'https://teamprojektstorage.blob.core.windows.net/files/' +
                      this.offer.pfad
                    "
                  />
                </div>

                <!--  -->
              </div>
              <div class="divider"></div>
              <div
                v-if="
                  this.offer.dateityp === 'image'
                  // ||this.offer.dateityp === 'glb'
                "
              >
                <div :style="styleDownload" class="download-container">
                  <a
                    :style="btnDownload"
                    @click="tagging"
                    class="btn btn-download"
                    >{{ name2 }}</a
                  >
                  <button :style="closeBtn" @click="close" class="closeBtn">
                    <i class="fas fa-times"></i>
                  </button>
                  <span :style="done" class="done" v-html="status"></span>
                </div>
              </div>
            </div>
            <div class="divider"></div>

            <p></p>
          </div>
        </div>
        <!-- <h4 align="left">Probability: {{ predictionProb }}</h4> -->
        <div></div>
        <!-- Button -->
        <div class="container">
          <div class="row">
            <label for="psw"><h4>Tags - (please separate by ",")</h4> </label>
          </div>
          <div class="row">
            <input
              style="width: 100%"
              id="TagsML"
              type="text"
              placeholder="Tags"
              v-model="MLTags"
              required
            />
          </div>
        </div>

        <button
          style="width: 100%"
          type="submit"
          @click.prevent="publishFile"
          class="publishbtn"
        >
          Publish
        </button>

        <h3 v-if="this.msg">{{ this.msg }}</h3>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
@import "../styles/publishStyle.css";
</style>

<style lang="scss">
@import "../styles/publishStyleButton.scss";
</style>

<script src="./PublishCode.js" defer></script>