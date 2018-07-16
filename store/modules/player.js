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
  active: state => (
    state.list
      .filter(player => player.status === 'Active')
      .sort((a, b) => state.positions.indexOf(a.pos) - state.positions.indexOf(b.pos))
  )
}

// actions
const actions = {
  refresh ({ state, commit, rootState }, { teamId }) {
    return apiRequest({
      path: myfifa.players.all,
      pathData: { teamId: teamId },
      token: rootState['user/token'],
      success: function ({ data }) {
        commit('refresh', data)
      },
      errorMessage: 'Failed to retrieve Players. Please try again.'
    })
  },
  get ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.players.get,
      pathData: { playerId: playerId },
      token: rootState['user/token'],
      errorMessage: 'Failed to retrieve Player. Please try again.'
    })
  },
  create ({ commit, rootState }, { teamId, player }) {
    return apiRequest({
      method: 'post',
      path: myfifa.players.all,
      pathData: { teamId: teamId },
      token: rootState['user/token'],
      data: { player: player },
      success: ({ data }) => {
        commit('add', data)
      },
      errorMessage: 'Failed to create Player. Please try again.'
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.players.get,
      pathData: { playerId: payload.id },
      token: rootState['user/token'],
      data: { player: payload },
      success: ({ data }) => {
        commit('update', data)
      },
      errorMessage: 'Failed to update Player. Please try again.'
    })
  },
  updateMultiple ({ commit, rootState }, { teamId, players }) {
    return apiRequest({
      method: 'patch',
      path: myfifa.players.update_multiple,
      pathData: { teamId: teamId },
      data: { players: players },
      success: ({ data }) => {
        commit('refresh', data)
      }
    })
  },
  destroy ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.players.get,
      pathData: { playerId: payload },
      token: rootState.user.token,
      success: ({ data }) => {
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Player. Please try again.'
    })
  },
  transfer ({ commit, rootState }, { playerId, transfer }) {
    return apiRequest({
      method: 'post',
      path: myfifa.transfers.all,
      pathData: { playerId: playerId },
      token: rootState['user/token'],
      data: { transfer: transfer },
      success: ({ data }) => {
        commit('update', data.player)
      },
      errorMessage: 'Failed to record Transfer. Please try again.'
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
