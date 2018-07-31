import Vue from 'vue'
import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
  list: {},
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
})

// getters
export const getters = {
  contracted: state => (
    Object.values(state.list)
      .filter(player => player.status)
      .sort((a, b) => state.positions.indexOf(a.pos) - state.positions.indexOf(b.pos))
  ),
  active: (state, getters) => (
    getters.contracted.filter(player => player.status === 'Active')
  )
}

// actions
export const actions = {
  refresh ({ state, commit, rootState }, { teamId }) {
    return apiRequest({
      path: myfifa.players.index,
      pathData: { teamId: teamId },
      token: rootState.token,
      success: function ({ data }) {
        commit('refresh', data)
      }
    })
  },
  get ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.players.record,
      pathData: { playerId: playerId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { teamId, player }) {
    return apiRequest({
      method: 'post',
      path: myfifa.players.index,
      pathData: { teamId: teamId },
      token: rootState.token,
      data: { player: player },
      success: ({ data }) => {
        commit('set', data)
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.players.record,
      pathData: { playerId: payload.id },
      token: rootState.token,
      data: { player: payload },
      success: ({ data }) => {
        commit('set', data)
      }
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
  remove ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.players.record,
      pathData: { playerId: payload },
      token: rootState.token,
      success: ({ data }) => {
        commit('remove', data.id)
      }
    })
  },
  transfer ({ commit, rootState }, { playerId, transfer }) {
    return apiRequest({
      method: 'post',
      path: myfifa.transfers.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { transfer: transfer },
      success: ({ data }) => {
        commit('set', data.player)
      }
    })
  },
  getActiveInjury ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.players.active_injury,
      pathData: { playerId: playerId },
      token: rootState.token
    })
  },
  getActiveLoan ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.players.active_loan,
      pathData: { playerId: playerId },
      token: rootState.token
    })
  }
}

// mutations
export const mutations = {
  refresh (state, players) {
    state.list = players.reduce((list, player) => {
      list[player.id] = player
      return list
    }, {})
  },
  set (state, player) {
    Vue.set(state.list, player.id, player)
  },
  remove (state, playerId) {
    Vue.delete(state.list, playerId)
  }
}