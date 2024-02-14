<template>
  <footer class="mt-auto p-3 border-top text-white text-center">

    <div class="container">

      <div class="row">

        <div class="col-6">
          <ul class="list-inline m-0">
            <router-link to="/">
              <li>
                <a style="color: white">Home</a>
              </li>
            </router-link>
            <router-link to="/Impressum">
              <li>
                <a style="color: white">Impress</a>
              </li>
            </router-link>
            <router-link to="/Datenschutz">
              <li>
                <a style="color: white">Privacy</a>
              </li>
            </router-link>
            <router-link to="/AboutUs">
              <li>
                <a style="color: white">About Us</a>
              </li>
            </router-link>
          </ul>
        </div>
        <div class="col-6" id="txt">
          <h5>Teamprojekt Sommersemester 2022</h5>
          <p>
            Fulda University of Applied Sciences Software Engineering Project,
            Spring 2022
          </p>
          <p id="demo">For Demonstration Only</p>
        </div>
      </div>
      <clock :time="time" size="180px"></clock>
    </div>
  </footer>
</template>

<style scoped>
footer {
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(2, 143, 65);
  font-size: 20px;
  text-align: center;
}

a {
  color: white;
}

#txt {
  font-size: 15px;
}

#demo {
  font-style: italic;
}


</style>

<style lang="scss">
.clock-second {
  background-color: rgb(255, 255, 255) !important;
  width: 3px !important; 
}

.clock-hour {
  background-color: rgb(255, 255, 255) !important;
  width: 5px !important; 
}

.clock-minute {
  background-color: rgb(255, 255, 255) !important;
  width: 4px !important; 
}
</style>

<script>
import Clock from 'vue-clock2';
  export default {
    components: { Clock },
    data () {
      return {
          time: '',
      }
    },
    methods: {
      getTimeClockTest(){
        let today = new Date();
        // console.log(`${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`)
        this.time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
      }
    }
    
  }
</script>



