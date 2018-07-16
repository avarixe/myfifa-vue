import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
const state = {
}

// getters
const getters = {
}

// actions
const actions = {
  // get ({ rootState }, { injuryId }) {
  //   return apiRequest({
  //     path: myfifa.injuries.get,
  //     pathData: { injuryId: injuryId },
  //     token: rootState.user.token,
  //     errorMessage: 'Failed to retrieve Injury. Please try again.'
  //   })
  // },
  create ({ commit, rootState }, { playerId, injury }) {
    return apiRequest({
      method: 'post',
      path: myfifa.injuries.all,
      pathData: { playerId: playerId },
      token: rootState.user.token,
      data: { injury: injury },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      },
      errorMessage: 'Failed to create Injury. Please try again.'
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.injuries.get,
      pathData: { injuryId: payload.id },
      token: rootState.user.token,
      data: { injury: payload },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      },
      errorMessage: 'Failed to update Injury. Please try again.'
    })
  }
  // delete ({ commit, rootState }, payload) {
  //   return apiRequest({
  //     method: 'delete',
  //     path: myfifa.injuries.get,
  //     pathData: { injuryId: payload },
  //     token: rootState.user.token,
  //     success: ({ data }) => {
  //       commit('remove', data)
  //     },
  //     errorMessage: 'Failed to delete Injury. Please try again.'
  //   })
  // }
}

// mutations
const mutations = {
}

export default {
  namespaced: true,

  state,
  getters,
  actions,
  mutations
}
