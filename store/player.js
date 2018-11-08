import Vue from 'vue'
import orderBy from 'lodash.orderby'
import $_http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

// initial state
export const state = () => ({
  loaded: false,
  list: {},
  positions: [
    'GK',
    'RB',
    'RWB',
    'CB',
    'LB',
    'LWB',
    'RM',
    'CDM',
    'CM',
    'CAM',
    'LM',
    'RW',
    'CF',
    'ST',
    'LW'
  ]
})

// getters
export const getters = {
  contracted: state => (
    orderBy(
      Object.values(state.list).filter(player => player.status),
      ['pos_idx', 'ovr'],
      ['asc', 'desc']
    )
  ),
  active: (state, getters) => (
    getters.contracted.filter(player => player.status === 'Active')
  )
}

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { teamId }) {
    if (!state.loaded) {
      return $_http({
        path: myfifa.players.index,
        pathData: { teamId },
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
      return $_http({
        path: myfifa.players.record,
        pathData: { playerId },
        token: rootState.token,
        success: ({ data }) => {
          commit('SET', data)
        }
      })
    }
  },
  getStatistics ({ commit, state, rootState }, { teamId, playerIds }) {
    return $_http({
      method: 'post',
      path: myfifa.teams.statistics,
      pathData: { teamId },
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
    return $_http({
      method: 'post',
      path: myfifa.players.index,
      pathData: { teamId },
      token: rootState.token,
      data: { player }
    })
  },
  update ({ commit, rootState }, player) {
    return $_http({
      method: 'patch',
      path: myfifa.players.record,
      pathData: { playerId: player.id },
      token: rootState.token,
      data: { player }
    })
  },
  remove ({ commit, rootState }, playerId) {
    return $_http({
      method: 'delete',
      path: myfifa.players.record,
      pathData: { playerId },
      token: rootState.token
    })
  },
  retire ({ commit, rootState }, playerId) {
    return $_http({
      method: 'post',
      path: myfifa.players.retire,
      pathData: { playerId },
      token: rootState.token
    })
  },
  release ({ commit, rootState }, playerId) {
    return $_http({
      method: 'post',
      path: myfifa.players.release,
      pathData: { playerId },
      token: rootState.token
    })
  },
  getHistory ({ state, commit, rootState }, { playerId }) {
    return $_http({
      path: myfifa.players.history,
      pathData: { playerId },
      token: rootState.token,
      success: function ({ data }) {
        commit('SET', {
          ...state.list[playerId],
          player_histories: objectify(data)
        })
      }
    })
  },
  getCurrentInjury ({ rootState }, { playerId }) {
    return $_http({
      path: myfifa.players.currentInjury,
      pathData: { playerId },
      token: rootState.token
    })
  },
  getCurrentLoan ({ rootState }, { playerId }) {
    return $_http({
      path: myfifa.players.currentLoan,
      pathData: { playerId },
      token: rootState.token
    })
  }
}

// mutations
export const mutations = {
  SET_ALL (state, players) {
    state.list = objectify(players)
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
