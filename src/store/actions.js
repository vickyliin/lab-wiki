import { gClientSettings, entry } from 'config'
import $ from 'ajax'
import { load_script } from 'ajax'

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
  async crud ({ commit, dispatch }, { type, path, data, id, readAfter = true }) {
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
    if (type !== 'read' && readAfter) return dispatch('crud', { path, type: 'read' })
    return response
  },
  async initChartjs ({ commit, state: { chartjs } }) {
    if (chartjs) return;
    await load_script('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.0/Chart.min.js')
    await load_script('https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels')
    let glob = Chart.defaults.global
    Chart.defaults.global = {
      ...glob,
      defaultFontColor: 'rgba(255,255,255,.8)',
      defaultFontSize: 14,
      defaultFontFamily: 'Roboto, Sans-serif'
    }
    glob.tooltips.callbacks.label = (
      {
        datasetIndex: i,
        yLabel
      },
      {
        datasets
      }
    ) => `${datasets[i].label}: ${yLabel.toLocaleString()} ${datasets[i].yAxisID}`
    glob.plugins.datalabels = {
      display: false,
      font: {
        size: 9,
        family: 'Verdana, Sans-serif'
      }
    }
    commit('chartjs')
  }
}
