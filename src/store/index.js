import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: 200,
    gAuth: null,
    user: null,
    userProfile: null,
    userRole: null,
    chartjs: false
  },
  mutations,
  actions,
  getters
})
