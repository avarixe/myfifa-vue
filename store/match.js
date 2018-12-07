import Vue from 'vue'
import http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

// initial state
export const state = () => ({
  loaded: false,
  list: {},
  positions: [
    'GK',
    'LB',
    'LWB',
    'LCB',
    'CB',
    'RCB',
    'RB',
    'RWB',
    'LM',
    'LDM',
    'LCM',
    'CDM',
    'CM',
    'RDM',
    'RCM',
    'RM',
    'LAM',
    'CAM',
    'RAM',
    'LW',
    'CF',
    'LS',
    'ST',
    'RS',
    'RW'
  ]
})

// getters
export const getters = {
  allByRecency: state => Object.values(state.list).reverse(),
  competitions: (state, getters) => [
    ...new Set(getters.allByRecency.map(match => match.competition))
  ],
  teams: (state, getters) => [
    ...new Set([
      ...getters.allByRecency.map(match => match.home),
      ...getters.allByRecency.map(match => match.away)
    ])
  ]
}

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { teamId }) {
    if (!state.loaded) {
      return http({
        path: myfifa.matches.index,
        pathData: { teamId },
        token: rootState.session.token,
        success: function ({ data }) {
          commit('SET_ALL', data)
        }
      })
    }
  },
  get ({ state, commit, rootState }, { matchId }) {
    if (matchId in state.list) {
      return { data: state.list[matchId] }
    } else {
      return http({
        path: myfifa.matches.record,
        pathData: { matchId },
        token: rootState.session.token,
        success: function ({ data }) {
          commit('SET', data)
        }
      })
    }
  },
  create ({ commit, rootState }, { teamId, match }) {
    return http({
      method: 'post',
      path: myfifa.matches.index,
      pathData: { teamId },
      token: rootState.session.token,
      data: { match }
    })
  },
  update ({ commit, rootState }, match) {
    return http({
      method: 'patch',
      path: myfifa.matches.record,
      pathData: { matchId: match.id },
      token: rootState.session.token,
      data: { match }
    })
  },
  remove ({ commit, rootState }, matchId) {
    return http({
      method: 'delete',
      path: myfifa.matches.record,
      pathData: { matchId },
      token: rootState.session.token
    })
  },
  getEvents ({ state, commit, rootState }, { matchId }) {
    return http({
      path: myfifa.matches.events,
      pathData: { matchId },
      token: rootState.session.token,
      success: ({ data }) => {
        commit('SET', {
          ...state.list[matchId],
          events: data
        })
      }
    })
  },
  applySquad ({ state, commit, rootState }, { matchId, squadId }) {
    return http({
      method: 'post',
      path: myfifa.matches.applySquad,
      pathData: { matchId },
      token: rootState.session.token,
      data: { squad_id: squadId }
    })
  }
}

// mutations
export const mutations = {
  SET_ALL (state, matches) {
    state.list = objectify(matches)
    state.loaded = true
  },
  SET (state, match) {
    Vue.set(state.list, match.id, match)
  },
  REMOVE (state, matchId) {
    Vue.delete(state.list, matchId)
  },
  RESET (state) {
    state.loaded = false
    state.list = {}
  }
}
