import Vuex from 'vuex'
import Vue from 'vue'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex);

const state = {
  login: false,
  index: ''
};

export default new Vuex.Store({
  state,
  mutations,
  getters
})
