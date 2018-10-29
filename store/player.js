import Vue from 'vue'
import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
  loaded: false,
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
      .sort((a, b) => a.pos_idx - b.pos_idx || b.ovr - a.ovr)
  ),
  active: (state, getters) => (
    getters.contracted.filter(player => player.status === 'Active')
  )
}

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { teamId }) {
    if (!state.loaded) {
      return apiRequest({
        path: myfifa.players.index,
        pathData: { teamId: teamId },
        token: rootState.token,
        success: function ({ data }) {
          commit('SET_ALL', data)
        }
      })
    }
  },
  get ({ state, commit, rootState }, { playerId }) {
    if (playerId in state.list) {
      return { data: state.list[playerId] }
    } else {
      return apiRequest({
        path: myfifa.players.record,
        pathData: { playerId: playerId },
        token: rootState.token,
        success: ({ data }) => {
          commit('SET', data)
        }
      })
    }
  },
  getStatistics ({ commit, state, rootState }, { teamId, playerIds }) {
    return apiRequest({
      method: 'post',
      path: myfifa.teams.statistics,
      pathData: { teamId: teamId },
      token: rootState.token,
      data: {
        query: {
          player_ids: playerIds
        }
      },
      success: ({ data }) => {
        for (let playerId of data.player_ids) {
          commit('SET', {
            ...state.list[playerId],
            num_games: data.num_games[playerId] || 0,
            num_goals: data.num_goals[playerId] || 0,
            num_assists: data.num_assists[playerId] || 0,
            num_cs: data.num_cs[playerId] || 0
          })
        }
      }
    })
  },
  create ({ commit, rootState }, { teamId, player }) {
    return apiRequest({
      method: 'post',
      path: myfifa.players.index,
      pathData: { teamId: teamId },
      token: rootState.token,
      data: { player: player }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.players.record,
      pathData: { playerId: payload.id },
      token: rootState.token,
      data: { player: payload }
    })
  },
  remove ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.players.record,
      pathData: { playerId: payload },
      token: rootState.token
    })
  },
  getHistory ({ state, commit, rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.players.history,
      pathData: { playerId: playerId },
      token: rootState.token,
      success: function ({ data }) {
        commit('SET', {
          ...state.list[playerId],
          player_histories: data
        })
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
  SET_ALL (state, players) {
    state.list = players.reduce((list, player) => {
      list[player.id] = player
      return list
    }, {})
    state.loaded = true
  },
  SET (state, player) {
    Vue.set(state.list, player.id, player)
  },
  REMOVE (state, playerId) {
    Vue.delete(state.list, playerId)
  },
  RESET (state) {
    state.loaded = false
    state.list = {}
  }
}
