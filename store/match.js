import Vue from 'vue'
import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

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
      return apiRequest({
        path: myfifa.matches.index,
        pathData: { teamId: teamId },
        token: rootState.token,
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
      return apiRequest({
        path: myfifa.matches.record,
        pathData: { matchId: matchId },
        token: rootState.token,
        success: function ({ data }) {
          commit('SET', data)
        }
      })
    }
  },
  create ({ commit, rootState }, { teamId, match }) {
    return apiRequest({
      method: 'post',
      path: myfifa.matches.index,
      pathData: { teamId: teamId },
      token: rootState.token,
      data: { match: match }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.matches.record,
      pathData: { matchId: payload.id },
      token: rootState.token,
      data: { match: payload }
    })
  },
  remove ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.matches.record,
      pathData: { matchId: payload },
      token: rootState.token
    })
  },
  getEvents ({ state, commit, rootState }, { matchId }) {
    return apiRequest({
      path: myfifa.matches.events,
      pathData: { matchId: matchId },
      token: rootState.token,
      success: ({ data }) => {
        commit('SET', {
          ...state.list[matchId],
          events: data
        })
      }
    })
  },
  applySquad ({ state, commit, rootState }, { matchId, squadId }) {
    return apiRequest({
      method: 'post',
      path: myfifa.matches.applySquad,
      pathData: { matchId: matchId },
      token: rootState.token,
      data: { squad_id: squadId }
    })
  }
}

// mutations
export const mutations = {
  SET_ALL (state, matches) {
    state.list = matches.reduce((list, match) => {
      list[match.id] = match
      return list
    }, {})
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
