import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
const state = {
  list: []
}

// getters
const getters = {
}

// actions
const actions = {
  refresh ({ state, commit, rootGetters }, { teamId }) {
    return apiRequest({
      path: myfifa.squads.all,
      pathData: { teamId: teamId },
      token: rootGetters['user/token'],
      success: function ({ data }) {
        commit('refresh', data)
      },
      errorMessage: 'Failed to retrieve Squads. Please try again.'
    })
  },
  get ({ rootGetters }, { squadId }) {
    return apiRequest({
      path: myfifa.squads.get,
      pathData: { squadId: squadId },
      token: rootGetters['user/token'],
      errorMessage: 'Failed to retrieve Squad. Please try again.'
    })
  },
  create ({ commit, rootGetters }, { teamId, squad }) {
    return apiRequest({
      method: 'post',
      path: myfifa.squads.all,
      pathData: { teamId: teamId },
      token: rootGetters['user/token'],
      data: { squad: squad },
      success: ({ data }) => {
        commit('add', data)
      },
      errorMessage: 'Failed to create Squad. Please try again.'
    })
  },
  update ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.squads.get,
      pathData: { squadId: payload.id },
      token: rootGetters['user/token'],
      data: { squad: payload },
      success: ({ data }) => {
        commit('update', data)
      },
      errorMessage: 'Failed to update Squad. Please try again.'
    })
  },
  destroy ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.squads.get,
      pathData: { squadId: payload },
      token: rootGetters['user/token'],
      success: ({ data }) => {
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Squad. Please try again.'
    })
  }
}

// mutations
const mutations = {
  refresh (state, squads) {
    state.list = squads
  },
  add (state, squad) {
    state.list.push(squad)
  },
  update (state, squad) {
    let index = state.list.findIndex(t => t.id === squad.id)
    state.list.splice(index, 1, squad)
  },
  remove (state, squad) {
    let index = state.list.findIndex(t => t.id === squad.id)
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
