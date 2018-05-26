import userApi from '@/api/user'

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
    return new Promise((resolve, reject) => {
      userApi.logUserIn(payload)
        .then(({ data }) => {
          if (data.access_token) {
            localStorage.setItem('token', data.access_token)
            commit('setToken', data.access_token)
            resolve()
          } else {
            reject(new Error('Failed to sign in.'))
          }
        })
        .catch((error) => {
          console.log(error)
          reject(new Error('Invalid Email or Password. Please try again.'))
        })
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
