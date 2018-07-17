import cookieparser from 'cookieparser'

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    let accessToken = null
    if (req.headers.cookie) {
      var parsed = cookieparser.parse(req.headers.cookie)
      accessToken = parsed.token
    }
    commit('user/setToken', accessToken)
  }
}
