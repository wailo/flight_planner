import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    flightPlans: [],
  },
  mutations: {
    setFlightPlans(state, flightPlans) {
      state.flightPlans = flightPlans
    }
  },
  actions: {},
  modules: {}
});
