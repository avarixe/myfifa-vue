import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
const state = {
  list: [],
  active: {
    id: null,
    title: '',
    current_date: null,
    currency: '$'
  }
}

// getters
const getters = {
  list: state => state.list,
  active: state => state.active
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
  get ({ commit, rootGetters }, { teamId, activate }) {
    return apiRequest({
      path: myfifa.teams.get,
      pathData: { teamId: teamId },
      token: rootGetters['user/token'],
      errorMessage: 'Failed to retrieve Team. Please try again.',
      success: ({ data }) => {
        activate && commit('set', data)
      }
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
        commit('set', data)
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
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Team. Please try again.'
    })
  }
}

// mutations
const mutations = {
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
  },
  set (state, team) {
    if (team !== null) {
      state.active = team
    } else {
      state.active = {
        id: null,
        title: '',
        current_date: null,
        currency: '$'
      }
    }
  }
}

export default {
  namespaced: true,

  state,
  getters,
  actions,
  mutations
}
