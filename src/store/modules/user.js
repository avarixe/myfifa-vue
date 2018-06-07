import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
const state = {
  token: localStorage.getItem('token')
}

// getters
const getters = {
  token: state => state.token
}

// actions
const actions = {
  logUserIn ({ commit }, payload) {
    return apiRequest({
      method: 'post',
      path: myfifa.login,
      data: payload,
      success: ({ data }) => {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token)
          commit('setToken', data.access_token)
        } else {
          throw new Error('Failed to sign in.')
        }
      },
      errorMessage: 'Invalid Email or Password. Please try again.'
    })
  },
  logUserOut ({ commit }) {
    localStorage.removeItem('token')
    commit('team/setActiveTeam', null, { root: true })
    commit('setToken', null)
  }
}

// mutations
const mutations = {
  setToken (state, token) {
    state.token = token
  }
}

export default {
  namespaced: true,

  state,
  getters,
  actions,
  mutations
}
