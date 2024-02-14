<template>
<div class="d-flex flex-column min-vh-100"> 
    <Navbar />
    <div class="row">
      <div class="column1">
        <div class="container">
          <img
            src="../assets/ImageJoerg.png"
            alt="Jörg"
            style="width: 100%"
          />
        </div>
      </div>
    <div class="column2">
      <div class="container">
          <h1 style="text-align: left;"><strong>J&ouml;rg Adelhelm</strong></h1>
          <p>&nbsp;</p>
          <p>&nbsp;</p>

          <h2 style="text-align: left;"><span style="text-decoration: underline;"><strong>E-Mail</strong></span></h2>
          <ul>
          <li><h3 style="text-align: left;"><a href="mailto:Joerg.adelhelm@gmx.de">Joerg.adelhelm@gmx.de</a></h3></li>
          </ul>
          <p>&nbsp;</p>

          
      </div>
    </div>
  </div>
  <Footer />
</div>
</template>

<style>
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

@media screen and (max-width: 650px) {
  .column {
    width: 100%;
    display: block;
  }
}
</style>

<script scoped>
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";

export default {
  name: "AboutJoerg",
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