import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: 200,
  },
  mutations: {
    status(state, n){
      state.status = n
    },
  },
})