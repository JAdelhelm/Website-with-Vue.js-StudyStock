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
      <div class="container">
        <h1>Register</h1>
        <p>Please fill in this form to create an account.</p>

        <label for="username"><b>Username</b></label>
        <input
          type="text"
          placeholder="Enter Username"
          v-model="username"
          name="username"
          id="username"
          required
        />

        <label for="email"><b>Email</b></label>
        <input
          type="text"
          placeholder="Enter Email"
          v-model="email"
          name="email"
          id="email"
          required
        />

        <label for="psw"><b>Password</b></label>
        <input
          type="password"
          placeholder="Enter Password"
          v-model="password"
          name="psw"
          id="psw"
          required
        />

        <label for="psw-repeat"><b>Repeat Password</b></label>
        <input
          type="password"
          placeholder="Repeat Password"
          v-model="password_repeat"
          name="psw-repeat"
          id="psw-repeat"
          required
        />

        <button type="submit" @click="signUp" class="registerbtn">
          Register
        </button>
        <p>Already have an account? <a href="login">Sign in</a>.</p>
        <p v-if="msg">{{ msg }}</p>
      </div>
    </div>
  </div>
</template>

<style>
/* Add padding to containers */
.container {
  padding: 16px;
}

/* Full-width input fields */
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

input[type="text"]:focus,
input[type="password"]:focus {
  background-color: #ddd;
  outline: none;
}

/* Set a style for the submit/register button */
.registerbtn {
  background-color: rgb(2, 143, 65);
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

.registerbtn:hover {
  opacity: 1;
}

/* Add a blue text color to links */
a {
  color: dodgerblue;
}

/* Set a grey background color and center the text of the "sign in" section */
.signin {
  background-color: #f1f1f1;
  text-align: center;
}
</style>

<script>
import AuthService from "@/services/AuthService.js";
import store from "../store.js";
import Header from "./Header.vue";

export default {
  name: "Register",
  components: {
    Header,
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      password_repeat: "",
      msg: "",
    };
  },
  methods: {
    async signUp() {
      try {
        const credentials = {
          username: this.username,
          email: this.email,
          password: this.password,
          password_repeat: this.password_repeat,
        };
        const credentials2 = {
          username: this.username,
          password: this.password,
        };
        const response = await AuthService.signUp(credentials);
        this.msg = response.msg;

        const response2 = await AuthService.login(credentials2);
        this.msg = response2.msg;

        const token = response2.token;
        const user = response2.user;
        const userid = response2.user.id;

        store.dispatch("login", { token, user, userid });

        this.$router.push("/");
      } catch (error) {
        this.msg = error.response.data.msg;
      }
    },
    sentToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>