import cookieparser from 'cookieparser'
import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
  token: null
})

// getters
export const getters = {
  authenticated: state => state.token !== null
}

// mutations
export const mutations = {
  setToken (state, token) {
    state.token = token
  }
}

// actions
export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    let accessToken = null
    if (req.headers.cookie) {
      var parsed = cookieparser.parse(req.headers.cookie)
      accessToken = parsed.token
    }
    commit('setToken', accessToken)
  },
  register ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'post',
      path: myfifa.users.register,
      data: { user: payload }
    })
  },
  login ({ commit }, payload) {
    return apiRequest({
      method: 'post',
      path: myfifa.token.get,
      data: payload,
      success: ({ data }) => {
        commit('setToken', data.access_token)
      }
    })
  },
  logout ({ commit, state }) {
    return apiRequest({
      method: 'post',
      path: myfifa.token.revoke,
      data: { token: state.token },
      success: ({ data }) => {
        commit('setToken', null)
      }
    })
  }
}
