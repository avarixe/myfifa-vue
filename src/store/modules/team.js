import teamApi from '@/api/team'

// initial state
const state = {
  activeId: localStorage.getItem('activeTeam')
}

// getters
const getters = {
  activeId: state => state.activeId
}

// actions
const actions = {
  getAllTeams ({ state, commit, rootGetters }) {
    return new Promise((resolve, reject) => {
      teamApi.getAllTeams({ token: rootGetters['user/token'] })
        .then(({ data }) => {
          if (!state.activeId && data.length > 0) {
            localStorage.setItem('activeIteam', data[0].id)
            commit('setActiveTeam', data[0].id)
          }
          resolve(data)
        })
        .catch((error) => {
          if (error) {
            reject(new Error('Failed to retrieve Teams. Please try again.'))
          }
        })
    })
  },
  getTeam ({ state, commit, rootGetters }, { teamId }) {
    return new Promise((resolve, reject) => {
      teamApi.getTeam({ token: rootGetters['user/token'], teamId: teamId })
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          if (error) {
            reject(new Error('Failed to retrieve Team. Please try again.'))
          }
        })
    })
  },
  saveTeam ({ state, commit, rootGetters }, payload) {
    return new Promise((resolve, reject) => {
      teamApi.saveTeam({ token: rootGetters['user/token'], team: payload })
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          if (error) {
            reject(new Error('Failed to save Team. Please try again.'))
          }
        })
    })
  }
}

// mutations
const mutations = {
  setActiveTeam (state, teamId) {
    state.activeId = teamId
  }
}

export default {
  namespaced: true,

  state,
  getters,
  actions,
  mutations
}
