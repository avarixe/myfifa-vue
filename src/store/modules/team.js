import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
const state = {
  activeId: localStorage.getItem('activeTeam'),
  list: []
}

// getters
const getters = {
  activeId: state => state.activeId,
  list: state => state.list
}

// actions
const actions = {
  refresh ({ state, commit, rootGetters }) {
    return apiRequest({
      path: myfifa.teams.all,
      token: rootGetters['user/token'],
      success: function ({ data }) {
        commit('refresh', data)
      },
      errorMessage: 'Failed to retrieve Teams. Please try again.'
    })
  },
  get ({ rootGetters }, { teamId }) {
    return apiRequest({
      path: myfifa.teams.get,
      pathData: { teamId: teamId },
      token: rootGetters['user/token'],
      errorMessage: 'Failed to retrieve Team. Please try again.'
    })
  },
  create ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'post',
      path: myfifa.teams.all,
      token: rootGetters['user/token'],
      data: { team: payload },
      success: ({ data }) => {
        commit('add', data)
      },
      errorMessage: 'Failed to create Team. Please try again.'
    })
  },
  update ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.teams.get,
      pathData: { teamId: payload.id },
      token: rootGetters['user/token'],
      data: { team: payload },
      success: ({ data }) => {
        commit('update', data)
      },
      errorMessage: 'Failed to update Team. Please try again.'
    })
  },
  delete ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.teams.get,
      pathData: { teamId: payload },
      token: rootGetters['user/token'],
      success: ({ data }) => {
        console.log(data)
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Team. Please try again.'
    })
  }
}

// mutations
const mutations = {
  set (state, teamId) {
    state.activeId = teamId
    if (teamId !== null) {
      localStorage.setItem('activeTeam', teamId)
    } else {
      localStorage.removeItem('activeTeam')
    }
  },
  refresh (state, teams) {
    state.list = teams
  },
  add (state, team) {
    state.list.push(team)
  },
  update (state, team) {
    let index = state.list.findIndex(t => t.id === team.id)
    state.list.splice(index, 1, team)
  },
  remove (state, team) {
    let index = state.list.findIndex(t => t.id === team.id)
    state.list.splice(index, 1)
  }
}

export default {
  namespaced: true,

  state,
  getters,
  actions,
  mutations
}
