import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// initial state
export const state = () => ({
  bonusRequirementTypes: [
    'Appearances',
    'Goals',
    'Assists',
    'Clean Sheets'
  ]
})

// actions
export const actions = {
  get ({ rootState }, { contractId }) {
    return apiRequest({
      path: myfifa.contracts.get,
      pathData: { contractId: contractId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { playerId, contract }) {
    return apiRequest({
      method: 'post',
      path: myfifa.contracts.all,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { contract: contract },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.contracts.get,
      pathData: { contractId: payload.id },
      token: rootState.token,
      data: { contract: payload },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      }
    })
  },
  delete ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.contracts.get,
      pathData: { contractId: payload },
      token: rootState.token,
      success: ({ data }) => {
        commit('remove', data)
      }
    })
  }
}
