import Vue from 'vue'
import orderBy from 'lodash.orderby'
import http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

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
      return http({
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
      return http({
        path: myfifa.players.record,
        pathData: { playerId },
        token: rootState.token,
        success: ({ data }) => {
          commit('SET', data)
        }
      })
    }
  },
  analyze ({ commit, state, rootState }, { teamId, playerIds }) {
    return http({
      method: 'post',
      path: myfifa.analyze.players,
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
    return http({
      method: 'post',
      path: myfifa.players.index,
      pathData: { teamId },
      token: rootState.token,
      data: { player }
    })
  },
  update ({ commit, rootState }, player) {
    return http({
      method: 'patch',
      path: myfifa.players.record,
      pathData: { playerId: player.id },
      token: rootState.token,
      data: { player }
    })
  },
  remove ({ commit, rootState }, playerId) {
    return http({
      method: 'delete',
      path: myfifa.players.record,
      pathData: { playerId },
      token: rootState.token
    })
  },
  retire ({ commit, rootState }, playerId) {
    return http({
      method: 'post',
      path: myfifa.players.retire,
      pathData: { playerId },
      token: rootState.token
    })
  },
  release ({ commit, rootState }, playerId) {
    return http({
      method: 'post',
      path: myfifa.players.release,
      pathData: { playerId },
      token: rootState.token
    })
  },
  getHistory ({ state, commit, rootState }, { playerId }) {
    return http({
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
    return http({
      path: myfifa.players.currentInjury,
      pathData: { playerId },
      token: rootState.token
    })
  },
  getCurrentLoan ({ rootState }, { playerId }) {
    return http({
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
