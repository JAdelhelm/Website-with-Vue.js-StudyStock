import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Bootstrap from 'bootstrap'

import Home from './components/Home.vue'
import AboutJoerg from './components/AboutJoerg.vue'
import AboutJulian from './components/AboutJulian.vue'
import AboutNiklas from './components/AboutNiklas.vue'
import AboutMaximilian from './components/AboutMaximilian.vue'
import AboutUs from './components/AboutUs.vue'
import Datenschutz from './components/Datenschutz.vue'
import Impressum from './components/Impressum.vue'
import Upload from './components/Upload.vue'
import Search from './components/Search.vue'
import Offer from './components/Offer.vue'
import Chat from './components/Chat.vue'
import Downloads from './components/Downloads.vue'
import Uploads from './components/Uploads.vue'
import Publish from './components/Publish.vue'
import Admin from './components/Admin.vue'
import Profil from "./components/Profil.vue"
import Offers from "./components/Offers.vue"
import StarRating from './components/star-rating.vue'
import Benutzer from './components/Benutzer.vue'
import NewService from './components/NewService.vue'
import Services from './components/Services.vue'
import EditService from './components/EditService.vue'
import Service from './components/Service'
import Statistics from './components/Statistics.vue'
import Requests from "./components/Requests.vue"
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import store from './store.js';
import Axios from 'axios';

Vue.config.productionTip = false
Vue.use(VueRouter)


// set auth header
Axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;

const routes = [{
    path: '/',
    name: "Home",
    component: Home
  },
  {
    path: '/AboutUs',
    name: "AboutUs",
    component: AboutUs
  },
  {
    path: '/Datenschutz',
    name: "Datenschutz",
    component: Datenschutz
  },
  {
    path: '/Impressum',
    name: "Impressum",
    component: Impressum
  },
  {
    path: '/AboutJoerg',
    name: "AboutJoerg",
    component: AboutJoerg
  },
  {
    path: '/AboutJulian',
    name: "AboutJulian",
    component: AboutJulian
  },
  {
    path: '/AboutNiklas',
    name: "AboutNiklas",
    component: AboutNiklas
  },
  {
    path: '/AboutMaximilian',
    name: "AboutMaximilian",
    component: AboutMaximilian
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  },
  {
    path: "/upload",
    name: "Upload",
    component: Upload
  },
  {
    path: "/offer",
    name: "Offer",
    component: Offer
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat
  },
  {
    path: "/downloads",
    name: "Downloads",
    component: Downloads
  },
  {
    path: "/uploads",
    name: "Uploads",
    component: Uploads
  },
  {
    path: "/publish",
    name: "Publish",
    component: Publish
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profil
  },
  {
    path: "/offers",
    name: "Offers",
    component: Offers
  },
  {
    path: "/rating",
    name: "star-rating",
    component: StarRating
  },
  {
    path: "/requests",
    name: "Requests",
    component: Requests
  },
  {
    path: "/user",
    name: "User",
    component: Benutzer
  },
  {
    path: "/newService",
    name: "NewService",
    component: NewService
  },
  {
    path: "/services",
    name: "Services",
    component: Services
  },
  {
    path: "/editservice",
    name: "EditService",
    component: EditService
  },
  {
    path: "/service",
    name: "Service",
    component: Service
  },
  {
    path: "/statistics",
    name: "Statistics",
    component: Statistics
  },

]

const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  router,
  render: h => h(App),
  Bootstrap
}).$mount('#app')