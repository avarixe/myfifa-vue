import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
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
})

// getters
export const getters = {
  active: state => (
    state.list
      .filter(player => player.status === 'Active')
      .sort((a, b) => state.positions.indexOf(a.pos) - state.positions.indexOf(b.pos))
  )
}

// actions
export const actions = {
  refresh ({ state, commit, rootState }, { teamId }) {
    return apiRequest({
      path: myfifa.players.all,
      pathData: { teamId: teamId },
      token: rootState.token,
      success: function ({ data }) {
        commit('refresh', data)
      }
    })
  },
  get ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.players.get,
      pathData: { playerId: playerId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { teamId, player }) {
    return apiRequest({
      method: 'post',
      path: myfifa.players.all,
      pathData: { teamId: teamId },
      token: rootState.token,
      data: { player: player },
      success: ({ data }) => {
        commit('add', data)
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.players.get,
      pathData: { playerId: payload.id },
      token: rootState.token,
      data: { player: payload },
      success: ({ data }) => {
        commit('update', data)
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
  destroy ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.players.get,
      pathData: { playerId: payload },
      token: rootState.token,
      success: ({ data }) => {
        commit('remove', data)
      }
    })
  },
  transfer ({ commit, rootState }, { playerId, transfer }) {
    return apiRequest({
      method: 'post',
      path: myfifa.transfers.all,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { transfer: transfer },
      success: ({ data }) => {
        commit('update', data.player)
      }
    })
  }
}

// mutations
export const mutations = {
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
