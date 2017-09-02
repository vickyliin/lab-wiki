import Vue from 'vue'
import Vuex from 'vuex'
import 'assets/js/platform'
// import 'assets/js/google.api-client'
import {gAuthSettings, entry} from 'config'
import $ from 'ajax'

Vue.use(Vuex)

const loginUrl = entry + '/login'
function setStateMutation(states){
  let mutations = {}
  for(let state of states){
    mutations[state] = (stateContext, value) => {
      stateContext[state] = value
    }
  }
  return mutations
}

export default new Vuex.Store({
  state: {
    status: 200,
    gAuth: null,
    user: null,
  },
  mutations: setStateMutation('status gAuth user'.split(' ')),
  actions: {
    gLoadAuth(){
      return new Promise(resolve =>
          gapi.load('auth2', resolve)
      )
    },
    async gAuthInit({commit, dispatch}){
      await dispatch('gLoadAuth')
      let gAuth = gapi.auth2.init(gAuthSettings)
      console.log(gAuth)
      commit('gAuth', gAuth)
      // console.log(gAuth)

      // return 1
      return {pack_the_data_here_and_vicky_is_god_and_kanna_shi_fan_you: gAuth}
    },
    // gAuthInit({commit, dispatch}){
    //   return new Promise(resolve => {
    //     dispatch('gLoadAuth').then(() =>{
    //       let gAuth = gapi.auth2.init(gAuthSettings)
    //       console.log(gAuth)
    //       // commit('gAuth', gAuth)
    //       resolve(gAuth)
    //     })
    //   })
    // },
    async gSignIn({state: {gAuth}, commit, dispatch}){
      // if(gAuth === null){
        gAuth = (await dispatch('gAuthInit')).pack_the_data_here_and_vicky_is_god_and_kanna_shi_fan_you
      // }
      let user
      try{
        console.log(gAuth)
        user = await gAuth.signIn()
        console.log('QAQ')
      }
      catch(e){
        console.log(`gAuth.signIn Error: ${e}`)
        user = null
      }
      commit('user', user)
      return user
    },
    // gSignIn({state: {gAuth}, commit, dispatch, state}){
    //   return new Promise(resolve => {
    //     if(gAuth === null){
    //       dispatch('gAuthInit').then(gAuth => {
    //         gAuth.signIn().then(user => {
    //           commit('user', user)
    //           resolve(user)
    //         })
    //       })
    //     }
    //   })
    // },
    async signIn({dispatch, commit}){
      let user = await dispatch('gSignIn')
      let {response, status} = await $.post({
        url: loginUrl,
        data: {id_token: user.getAuthResponse().id_token}
      })
      console.log(response, status)
      commit('status', status)
    },
    // signIn({dispatch, commit}){
    //   dispatch('gSignIn').then(user => {
    //     $.post({
    //       url: loginUrl,
    //       data: {id_token: user.getAuthResponse().id_token}
    //     }).then(({response, status}) => {
    //       console.log(response, status)
    //       commit('status', status)
    //     })
    //   })
    // },
  },
})
