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
  getAll ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.contracts.index,
      pathData: { playerId: playerId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { playerId, contract }) {
    return apiRequest({
      method: 'post',
      path: myfifa.contracts.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { contract: contract },
      success: ({ data }) => {
        commit('player/SET', data, { root: true })
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.contracts.record,
      pathData: { contractId: payload.id },
      token: rootState.token,
      data: { contract: payload },
      success: ({ data }) => {
        commit('player/SET', data, { root: true })
      }
    })
  }
}
