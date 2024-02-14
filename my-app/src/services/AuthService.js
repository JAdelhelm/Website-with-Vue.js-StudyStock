// src/services/AuthService.js
import axios from 'axios';

export default {
  login(credentials) {
    console.log(credentials);
    return axios
      .post('/api/login', credentials)
      .then(response => response.data);
  },
  signUp(credentials) {
    return axios
      .post('/api/register', credentials)
      .then(response => response.data);
  }
};