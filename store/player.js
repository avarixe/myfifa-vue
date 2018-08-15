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
  get ({ commit, rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.players.record,
      pathData: { playerId: playerId },
      token: rootState.token,
      success: ({ data }) => {
        commit('set', data)
      }
    })
  },
  analyze ({ commit, state, rootState }, player) {
    return apiRequest({
      method: 'post',
      path: myfifa.teams.statistics,
      pathData: { teamId: player.team_id },
      data: {
        query: {
          player_ids: [ player.id ]
        }
      },
      success: ({ data }) => {
        commit('set', {
          ...state.list[player.id],
          num_games: data.num_games[player.id],
          num_goals: data.num_goals[player.id],
          num_assists: data.num_assists[player.id]
        })
      }
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
  getCurrentInjury ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.players.current_injury,
      pathData: { playerId: playerId },
      token: rootState.token
    })
  },
  getCurrentLoan ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.players.current_loan,
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
