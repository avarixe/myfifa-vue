import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
const state = {
  token: localStorage.getItem('token')
}

// getters
const getters = {
  token: state => state.token,
  authenticated: state => (state.token !== null)
}

// mutations
const mutations = {
  set (state, token) {
    state.token = token
    if (token === null) {
      localStorage.removeItem('token')
    }
  }
}

// actions
const actions = {
  login ({ commit, dispatch }, payload) {
    return apiRequest({
      method: 'post',
      path: myfifa.token.get,
      data: payload,
      success: ({ data }) => {
        localStorage.setItem('token', data.access_token)
        commit('set', data.access_token)
        dispatch('info')
      },
      errorMessage: 'Invalid Email or Password. Please try again.'
    })
  },
  logout ({ commit, state }) {
    return apiRequest({
      method: 'post',
      path: myfifa.token.revoke,
      data: { token: state.token },
      success: ({ data }) => {
        commit('team/set', null, { root: true })
        commit('set', null)
      },
      errorMessage: 'An error occurred when logging out. Please try again.'
    })
  },
  info ({ state }) {
    return apiRequest({
      path: myfifa.user,
      token: state.token,
      success: ({ data }) => {
        console.log(data)
      }
    })
  }
}

export default {
  namespaced: true,

  state,
  getters,
  mutations,
  actions
}
