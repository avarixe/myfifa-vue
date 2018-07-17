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
      token: rootState.user.token,
      errorMessage: 'Failed to retrieve Contract. Please try again.'
    })
  },
  create ({ commit, rootState }, { playerId, contract }) {
    return apiRequest({
      method: 'post',
      path: myfifa.contracts.all,
      pathData: { playerId: playerId },
      token: rootState.user.token,
      data: { contract: contract },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      },
      errorMessage: 'Failed to create Contract. Please try again.'
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.contracts.get,
      pathData: { contractId: payload.id },
      token: rootState.user.token,
      data: { contract: payload },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      },
      errorMessage: 'Failed to update Contract. Please try again.'
    })
  },
  delete ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.contracts.get,
      pathData: { contractId: payload },
      token: rootState.user.token,
      success: ({ data }) => {
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Contract. Please try again.'
    })
  }
}
