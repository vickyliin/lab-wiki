import 'assets/js/platform'
import { gClientSettings, entry } from 'config'
import $ from 'ajax'

const loginUrl = entry + '/login'
const logoutUrl = entry + '/logout'
const userUrl = entry + '/user'

const getUserRole = async () => {
  let { response: user } = await $.get({ url: userUrl })
  return user.role
}

let authentications = {
  gLoadAuth () {
    return new Promise(resolve =>
      gapi.load('client:auth2', resolve)
    )
  },
  async gAuthInit ({ commit, dispatch, state: { gAuth } }) {
    if (gAuth) return
    await dispatch('gLoadAuth')
    await gapi.client.init(gClientSettings)
    gAuth = gapi.auth2.getAuthInstance()
    await gAuth.then()
    commit('gAuth', gAuth)
    return [gAuth]
  },
  async authInit ({ commit, dispatch, state: { gAuth } }) {
    if (!gAuth) {
      [gAuth] = await dispatch('gAuthInit')
    }
    let user = gAuth.currentUser.get()
    if (user) commit('user', user)
    await dispatch('signIn', user)
  },
  async gSignIn ({ state: { gAuth }, commit, dispatch }) {
    if (!gAuth) {
      [gAuth] = await dispatch('gAuthInit')
    }
    let user
    try {
      user = await gAuth.signIn({
        prompt: 'select_account'
      })
    } catch ({ error }) {
      throw Error(`gAuth.signIn Error: ${error}`)
    }
    commit('user', user)
    return user
  },
  async signIn ({ dispatch, commit }, user) {
    if (!user) {
      try {
        user = await dispatch('gSignIn')
      } catch (e) {
        return
      }
    }
    let { status } = await $.post({
      url: loginUrl,
      data: { id_token: user.getAuthResponse().id_token }
    })
    commit('userRole', await getUserRole())
    commit('status', status)
  },
  async gSignOut ({ state: { gAuth }, commit, dispatch }) {
    if (gAuth === null) {
      [gAuth] = await dispatch('gAuthInit')
    }
    try {
      await gAuth.signOut()
    } catch ({ error }) {
      throw Error(`gAuth.signOut Error: ${error}`)
    }
    commit('user', null)
  },
  async signOut ({ dispatch, commit }) {
    await dispatch('gSignOut')
    await $.post({ url: logoutUrl })
    commit('status', 401)
  }
}

export default {
  ...authentications,
  async crud ({ commit, dispatch }, { type, path, data, id }) {
    let reqType = {
      create: 'post',
      read: 'get',
      update: 'post',
      delete: 'delete'
    }[type] || type

    let { response, status } = await $[reqType]({
      url: entry + path + (id ? `/${id}` : ''),
      data
    })
    commit('status', status)

    if (status !== 200) return null
    if (type !== 'read') return dispatch('crud', { path, type: 'read' })
    return response
  }
}
