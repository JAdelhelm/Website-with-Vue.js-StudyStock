<template>
  <div style="text-align: center">
    <Header />

    <div 
      class="border"
      style="
        margin-top: 20px;
        border: solid #ccc;
        border-width: thin thin;
        margin-right: 20%;
        margin-left: 20%;
        margin-bottom: 20px;
      "
    >
      <div class="container" style="text-align: center">
        <h1><u>Login</u></h1>

        <div class="imgcontainer">
          <img
            src="../assets/Portrait_Placeholder.png"
            alt="Avatar"
            class="avatar"
          />
        </div>
        <div class="container" style="text-align: center" >
          <label for="uname"><b>Username</b></label
          ><br />
          <input
          
            style="
              width: 100%;
              padding: 12px 20px;
              margin: 8px 0;
              display: inline-block;
              border: 1px solid #ccc;
              box-sizing: border-box;
            "
            type="text"
            placeholder="Enter Username"
            name="uname"
            v-on:keyup.enter="login"
            v-model="username"
            required
          /><br />
          <label for="psw"><b>Password</b></label
          ><br />
          <input
            style="
              width: 100%;
              padding: 12px 20px;
              margin: 8px 0;
              display: inline-block;
              border: 1px solid #ccc;
              box-sizing: border-box;
            "
            type="password"
            placeholder="Enter Password"
            name="psw"
            id="myInput"
            v-on:keyup.enter="login"
            v-model="password"
            required
          /><br />
          <button 
            style="
              background-color: rgb(2, 143, 65);
              color: white;
              padding: 14px 20px;
              margin: 8px 0;
              border: none;
              cursor: pointer;
              width: 100%;
            "
            
            id="myBtn" v-if="this.role != 3"
            @click="login"
          >
            Login</button
          ><br />
          <button
            style="
              background-color: rgb(2, 143, 65);
              color: white;
              padding: 14px 20px;
              margin: 8px 0;
              border: none;
              cursor: pointer;
              width: 100%;
            "
            type="submit"
            @click="sentToRegister"
          >
            Register
          </button>

          <p v-if="msg">{{ msg }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:hover {
  opacity: 0.8;
}

/* Center the image and position the close button */
.imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
  position: relative;
}

img.avatar {
  width: 17%;
  border-radius: 50%;
}

.container {
  padding: 16px;
}

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
  span.psw {
    display: block;
    float: none;
  }
}
</style>

<script>
import AuthService from "@/services/AuthService.js";
import store from "../store.js";
import Header from "./Header.vue";

export default {
  name: "Login",
  components: {
    Header,
  },
  data() {
    return {
      username: "",
      password: "",
      msg: "",
      role: 0,
    };
  },
  methods: {
    
    async login() {
      try {
        const credentials = {
          username: this.username,
          password: this.password,
        };
        const response = await AuthService.login(credentials);
        this.msg = response.msg;
        const role = response.user.rolle;
        const token = response.token;
        const user = response.user;
        const userid = response.user.id;

        // Hier prüfen auf Rolle=3, wenn 3 dann login nicht zulassen
        console.log(role)
        if (role != 3){      
          store.dispatch("login", { token, user, userid, role });

          this.$router.push("/");
        }
        else{
          this.msg = "You are locked!"
        }

      } catch (error) {
        this.msg = error.response.data.msg;
      }
    },
    sentToRegister() {
      this.$router.push("/register");
    },
  },
    mounted() {
    //Unterscheidung zwischen Prod und Dev
    if (window.location.hostname.includes("localhost")) {
      this.dev = "true";
    } else {
      this.prod = "true";
    }

    }
};
</script>