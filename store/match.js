import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
  list: [],
  positions: [
    'GK',
    'CB',
    'LCB',
    'RCB',
    'LB',
    'LWB',
    'RB',
    'RWB',
    'CDM',
    'LDM',
    'RDM',
    'CM',
    'LCM',
    'RCM',
    'CAM',
    'LAM',
    'RAM',
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
  competitions: state => [ ...new Set(state.list.map(match => match.competition)) ].reverse(),
  teams: state => [ ...new Set([ ...state.list.map(match => match.home), ...state.list.map(match => match.away) ]) ]
}

// actions
export const actions = {
  refresh ({ state, commit, rootState }, { teamId }) {
    return apiRequest({
      path: myfifa.matches.all,
      pathData: { teamId: teamId },
      token: rootState.token,
      success: function ({ data }) {
        commit('refresh', data)
      },
      errorMessage: 'Failed to retrieve Matches. Please try again.'
    })
  },
  get ({ rootState }, { matchId }) {
    return apiRequest({
      path: myfifa.matches.get,
      pathData: { matchId: matchId },
      token: rootState.token,
      errorMessage: 'Failed to retrieve Match. Please try again.'
    })
  },
  create ({ commit, rootState }, { teamId, match }) {
    return apiRequest({
      method: 'post',
      path: myfifa.matches.all,
      pathData: { teamId: teamId },
      token: rootState.token,
      data: { match: match },
      success: ({ data }) => {
        commit('add', data)
      },
      errorMessage: 'Failed to create Match. Please try again.'
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.matches.get,
      pathData: { matchId: payload.id },
      token: rootState.token,
      data: { match: payload },
      success: ({ data }) => {
        commit('update', data)
      },
      errorMessage: 'Failed to update Match. Please try again.'
    })
  },
  destroy ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.matches.get,
      pathData: { matchId: payload },
      token: rootState.token,
      success: ({ data }) => {
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Match. Please try again.'
    })
  },
  addLog ({ commit, rootState }, { matchId, matchLog }) {
    return apiRequest({
      method: 'post',
      path: myfifa.matchLogs.all,
      pathData: { matchId: matchId },
      token: rootState.token,
      data: { match_log: matchLog },
      success: ({ data }) => {
        commit('update', data)
      },
      errorMessage: 'Failed to add Player to Match Log. Please try again.'
    })
  },
  updateLog ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.matchLogs.get,
      pathData: { logId: payload.id },
      token: rootState.token,
      data: { match_log: payload },
      success: ({ data }) => {
        commit('update', data)
      },
      errorMessage: 'Failed to update Match Log. Please try again.'
    })
  }
}

// mutations
export const mutations = {
  refresh (state, matches) {
    state.list = matches
  },
  add (state, match) {
    state.list.push(match)
  },
  update (state, match) {
    let index = state.list.findIndex(t => t.id === match.id)
    state.list.splice(index, 1, match)
  },
  remove (state, match) {
    let index = state.list.findIndex(t => t.id === match.id)
    state.list.splice(index, 1)
  }
}
