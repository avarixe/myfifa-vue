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
  SET_TOKEN (state, token) {
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
    commit('SET_TOKEN', accessToken)
  },
  login ({ commit }, payload) {
    return apiRequest({
      method: 'post',
      path: myfifa.token.get,
      data: payload,
      success: ({ data }) => {
        commit('SET_TOKEN', data.access_token)
        commit('broadcaster/ANNOUNCE', {
          message: 'You have successfully logged in!',
          color: 'success'
        }, { root: true })
      }
    })
  },
  logout ({ commit, state }) {
    return apiRequest({
      method: 'post',
      path: myfifa.token.revoke,
      data: { token: state.token },
      success: ({ data }) => {
        commit('SET_TOKEN', null)
        commit('broadcaster/ANNOUNCE', {
          message: 'You have successfully logged out!',
          color: 'danger'
        }, { root: true })
      }
    })
  }
}
