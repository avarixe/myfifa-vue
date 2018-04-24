// import teamApi from '@/api/team'

// initial state
const state = {
}

// getters
const getters = {
}

// actions
const actions = {
  getAllTeams ({ commit, rootGetters }) {
    return rootGetters['user/token']
  }
}

// mutations
const mutations = {
  setActiveTeam (state, teamId) {
  }
}

export default {
  namespaced: true,

  state,
  getters,
  actions,
  mutations
}
