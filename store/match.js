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
    'LCB',
    'RCB',
    'RB',
    'RWB',
    'LDM',
    'CDM',
    'RDM',
    'LM',
    'LCM',
    'CM',
    'RCM',
    'RM',
    'LAM',
    'CAM',
    'RAM',
    'LW',
    'RW',
    'CF',
    'ST'
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
  refresh ({ state, commit, rootState }, { teamId }) {
    return apiRequest({
      path: myfifa.matches.index,
      pathData: { teamId: teamId },
      token: rootState.token,
      success: function ({ data }) {
        commit('refresh', data)
      }
    })
  },
  get ({ rootState }, { matchId }) {
    return apiRequest({
      path: myfifa.matches.record,
      pathData: { matchId: matchId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { teamId, match }) {
    return apiRequest({
      method: 'post',
      path: myfifa.matches.index,
      pathData: { teamId: teamId },
      token: rootState.token,
      data: { match: match },
      success: ({ data }) => {
        commit('set', data)
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.matches.record,
      pathData: { matchId: payload.id },
      token: rootState.token,
      data: { match: payload },
      success: ({ data }) => {
        commit('set', data)
      }
    })
  },
  remove ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.matches.record,
      pathData: { matchId: payload },
      token: rootState.token,
      success: ({ data }) => {
        commit('remove', data.id)
      }
    })
  },
  getEvents ({ state, commit, rootState }, { matchId }) {
    return apiRequest({
      path: myfifa.matches.events,
      pathData: { matchId: matchId },
      token: rootState.token,
      success: ({ data }) => {
        commit('set', {
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
      data: { squad_id: squadId },
      success: ({ data }) => {
        commit('set', {
          ...state.list[matchId],
          performances: data
        })
      }
    })
  }
}

// mutations
export const mutations = {
  refresh (state, matches) {
    state.list = matches.reduce((list, match) => {
      list[match.id] = match
      return list
    }, {})
  },
  set (state, match) {
    Vue.set(state.list, match.id, match)
  },
  remove (state, matchId) {
    Vue.delete(state.list, matchId)
  },
  setPerformance (state, performance) {
    let performances = state.list[performance.match_id].performances
    const pIdx = performances.findIndex(p => p.id === performance.id)
    if (pIdx > -1) {
      performances.splice(pIdx, 1, performance)
    } else {
      performances.push(performance)
    }
    state.list[performance.match_id].performances = performances
  }
}
