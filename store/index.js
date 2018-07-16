import Vue from 'vue'
import Vuex from 'vuex'
import cookieparser from 'cookieparser'

import modules from './modules'

Vue.use(Vuex)

const actions = {
  nuxtServerInit ({ commit }, { req }) {
    let accessToken = null
    if (req.headers.cookie) {
      var parsed = cookieparser.parse(req.headers.cookie)
      accessToken = parsed.token
    }
    commit('user/setToken', accessToken)
  }
}

export default () => new Vuex.Store({
  modules,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
