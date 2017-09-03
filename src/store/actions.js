import 'assets/js/platform'
import {gAuthSettings, entry} from 'config'
import $ from 'ajax'

const loginUrl = entry + '/login'
const logoutUrl = entry + '/logout'

let authentications = {
  gLoadAuth(){
    return new Promise(resolve =>
        gapi.load('auth2', resolve)
    )
  },
  async gAuthInit({commit, dispatch}){
    await dispatch('gLoadAuth')
    let gAuth = gapi.auth2.init(gAuthSettings)
    commit('gAuth', gAuth)
    await gAuth.then()

    let user = gAuth.currentUser.get()
    if(user) commit('user', user)

    return [gAuth]
  },
  async gSignIn({state: {gAuth}, commit, dispatch}){
    if(!gapi.auth2){
      gAuth = (await dispatch('gAuthInit'))[0]
    }
    else{
      await gAuth.then()
    }
    let user
    try{
      user = await gAuth.signIn({
        prompt: 'select_account'
      })
    }
    catch({error}){
      throw Error(`gAuth.signIn Error: ${error}`)
    }
    commit('user', user)
    return user
  },
  async signIn({dispatch, commit}){
    let user
    try{
      user = await dispatch('gSignIn')
    }
    catch(e){
      return
    }
    let {status} = await $.post({
      url: loginUrl,
      data: {id_token: user.getAuthResponse().id_token}
    })
    commit('status', status)
  },
  async gSignOut({state: {gAuth}, commit, dispatch}){
    if(gAuth === null){
      gAuth = (await dispatch('gAuthInit'))[0]
    }
    try{
      await gAuth.signOut()
    }
    catch({error}){
      throw Error(`gAuth.signOut Error: ${error}`)
    }
    commit('user', null)
  },
  async signOut({dispatch, commit}){
    await dispatch('gSignOut')
    await $.post({url: logoutUrl})
    commit('status', 401)
  }
}

export default {
  ...authentications,
  async getData({commit}, model){
    let {response, status} = await $.get({
      url: entry + model
    })
    commit('status', status)
    if(status !== 200) return null
    return response
  }
}