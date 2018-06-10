import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

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
    return apiRequest({
      path: myfifa.teams.all,
      token: rootGetters['user/token'],
      success: function ({ data }) {
        if (!state.activeId && data.length > 0) {
          localStorage.setItem('activeIteam', data[0].id)
          commit('setActiveTeam', data[0].id)
        }
      },
      errorMessage: 'Failed to retrieve Teams. Please try again.'
    })
  },
  getTeam ({ rootGetters }, { teamId }) {
    return apiRequest({
      path: myfifa.teams.get,
      pathData: { teamId: teamId },
      token: rootGetters['user/token'],
      errorMessage: 'Failed to retrieve Team. Please try again.'
    })
  },
  create ({ rootGetters }, payload) {
    return apiRequest({
      method: 'post',
      path: myfifa.teams.all,
      token: rootGetters['user/token'],
      data: { team: payload },
      errorMessage: 'Failed to create Team. Please try again.'
    })
  },
  update ({ rootGetters }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.teams.get,
      pathData: { teamId: payload.id },
      token: rootGetters['user/token'],
      data: { team: payload },
      errorMessage: 'Failed to update Team. Please try again.'
    })
  },
  delete ({ rootGetters }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.teams.get,
      pathData: { teamId: payload },
      token: rootGetters['user/token'],
      errorMessage: 'Failed to delete Team. Please try again.'
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
