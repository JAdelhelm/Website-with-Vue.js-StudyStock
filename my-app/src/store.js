// src/store.js (Vue CLI 1.x & 2.x) oder src/store/index.js (Vue CLI 3.x oder neuer)

import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    token: '',
    user: {},
    userid: ''
  };
};

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: getDefaultState(),
  getters: {
    isLoggedIn: state => {
      return state.token;
    },
    getUser: state => {
      return state.user;
    },
    getUserID: state => {
      return state.userid;
    },
    getRole: state => {
      return state.user.role;
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_USERID: (state, userid) => {
      state.userid = userid;
    },
    SET_ROLE: (state, role) => {
      state.user.role = role;
    },
    RESET: state => {
      Object.assign(state, getDefaultState());
    }
  },
  actions: {
    login: ({
      commit,
      dispatch
    }, {
      token,
      user,
      userid,
      role
    }) => {
      console.log(dispatch);
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
      commit('SET_USERID', userid);
      commit('SET_ROLE', role)

      // set auth header
      Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    logout: ({
      commit
    }) => {
      commit('RESET', '');
    }
  }
});