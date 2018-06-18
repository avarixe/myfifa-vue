import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
const state = {
  list: [],
  positions: [
    'GK',
    'CB',
    'LB',
    'LWB',
    'RB',
    'RWB',
    'CDM',
    'CM',
    'CAM',
    'LM',
    'LW',
    'RM',
    'RW',
    'CF',
    'ST'
  ]
}

// getters
const getters = {
}

// actions
const actions = {
  refresh ({ state, commit, rootGetters }, { teamId }) {
    return apiRequest({
      path: myfifa.players.all,
      pathData: { teamId: teamId },
      token: rootGetters['user/token'],
      success: function ({ data }) {
        commit('refresh', data)
      },
      errorMessage: 'Failed to retrieve Players. Please try again.'
    })
  },
  get ({ rootGetters }, { playerId }) {
    return apiRequest({
      path: myfifa.players.get,
      pathData: { playerId: playerId },
      token: rootGetters['user/token'],
      errorMessage: 'Failed to retrieve Player. Please try again.'
    })
  },
  create ({ commit, rootGetters }, { teamId, player }) {
    return apiRequest({
      method: 'post',
      path: myfifa.players.all,
      pathData: { teamId: teamId },
      token: rootGetters['user/token'],
      data: { player: player },
      success: ({ data }) => {
        commit('add', data)
      },
      errorMessage: 'Failed to create Player. Please try again.'
    })
  },
  update ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.players.get,
      pathData: { playerId: payload.id },
      token: rootGetters['user/token'],
      data: { player: payload },
      success: ({ data }) => {
        commit('update', data)
      },
      errorMessage: 'Failed to update Player. Please try again.'
    })
  },
  delete ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.players.get,
      pathData: { playerId: payload },
      token: rootGetters['user/token'],
      success: ({ data }) => {
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Player. Please try again.'
    })
  }
}

// mutations
const mutations = {
  refresh (state, players) {
    state.list = players
  },
  add (state, player) {
    state.list.push(player)
  },
  update (state, player) {
    let index = state.list.findIndex(t => t.id === player.id)
    state.list.splice(index, 1, player)
  },
  remove (state, player) {
    let index = state.list.findIndex(t => t.id === player.id)
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
