import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
const state = {
  list: []
}

// getters
const getters = {
  competitions: state => [ ...new Set(state.list.map((match) => match.competition)) ]
}

// actions
const actions = {
  refresh ({ state, commit, rootGetters }, { teamId }) {
    return apiRequest({
      path: myfifa.matches.all,
      pathData: { teamId: teamId },
      token: rootGetters['user/token'],
      success: function ({ data }) {
        commit('refresh', data)
      },
      errorMessage: 'Failed to retrieve Matches. Please try again.'
    })
  },
  get ({ rootGetters }, { matchId }) {
    return apiRequest({
      path: myfifa.matches.get,
      pathData: { matchId: matchId },
      token: rootGetters['user/token'],
      errorMessage: 'Failed to retrieve Match. Please try again.'
    })
  },
  create ({ commit, rootGetters }, { teamId, match }) {
    return apiRequest({
      method: 'post',
      path: myfifa.matches.all,
      pathData: { teamId: teamId },
      token: rootGetters['user/token'],
      data: { match: match },
      success: ({ data }) => {
        commit('add', data)
      },
      errorMessage: 'Failed to create Match. Please try again.'
    })
  },
  update ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.matches.get,
      pathData: { matchId: payload.id },
      token: rootGetters['user/token'],
      data: { match: payload },
      success: ({ data }) => {
        commit('update', data)
      },
      errorMessage: 'Failed to update Match. Please try again.'
    })
  },
  destroy ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.matches.get,
      pathData: { matchId: payload },
      token: rootGetters['user/token'],
      success: ({ data }) => {
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Match. Please try again.'
    })
  }
}

// mutations
const mutations = {
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

export default {
  namespaced: true,

  state,
  getters,
  actions,
  mutations
}
