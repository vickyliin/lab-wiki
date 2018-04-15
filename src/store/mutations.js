function setStateMutation (states) {
  let mutations = {}
  for (let state of states) {
    mutations[state] = (stateContext, value) => {
      stateContext[state] = value
    }
  }
  return mutations
}

export default{
  user (state, user) {
    state.user = user
    if (user) state.userProfile = user.getBasicProfile()
    else state.userProfile = null
  },
  chartjs (state) {
    state.chartjs = 1
  },
  ...setStateMutation('status gAuth userRole'.split(' '))
}
