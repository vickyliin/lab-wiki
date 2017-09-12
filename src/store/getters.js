function profileGetters (mapper) {
  let getters = {}
  for (let [name, getter] of Object.entries(mapper)) {
    getters[name] = state => {
      if (!state.userProfile) return
      return state.userProfile[getter]()
    }
  }
  return getters
}

export default{
  userDomain (state) {
    if (!state.user) return
    return state.user.getHostedDomain()
  },
  ...profileGetters({
    userImg: 'getImageUrl',
    userName: 'getName',
    userEmail: 'getEmail'
  })
}
