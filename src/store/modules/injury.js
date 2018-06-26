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
  get ({ rootGetters }, { injuryId }) {
    return apiRequest({
      path: myfifa.injuries.get,
      pathData: { injuryId: injuryId },
      token: rootGetters['user/token'],
      errorMessage: 'Failed to retrieve Injury. Please try again.'
    })
  },
  create ({ commit, rootGetters }, { playerId, injury }) {
    return apiRequest({
      method: 'post',
      path: myfifa.injuries.all,
      pathData: { playerId: playerId },
      token: rootGetters['user/token'],
      data: { injury: injury },
      errorMessage: 'Failed to create Injury. Please try again.'
    })
  },
  update ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.injuries.get,
      pathData: { injuryId: payload.id },
      token: rootGetters['user/token'],
      data: { injury: payload },
      errorMessage: 'Failed to update Injury. Please try again.'
    })
  },
  delete ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.injuries.get,
      pathData: { injuryId: payload },
      token: rootGetters['user/token'],
      success: ({ data }) => {
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Injury. Please try again.'
    })
  }
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
