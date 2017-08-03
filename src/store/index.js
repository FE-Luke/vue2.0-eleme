import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  seller: {},
  cart: []
};

const mutations = {
  SET_SELLER: (state, payload) => {
    state.seller = payload;
  },
  SET_CART: (state, payload) => {
    state.cart = payload;
  }
};

const getters = {
  seller: (state) => state.seller,
  cart: (state) => state.cart
};

export default new Vuex.Store({
  state,
  mutations,
  getters
});
