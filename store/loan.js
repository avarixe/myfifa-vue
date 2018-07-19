import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  get ({ rootState }, { loanId }) {
    return apiRequest({
      path: myfifa.loans.get,
      pathData: { loanId: loanId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { playerId, loan }) {
    return apiRequest({
      method: 'post',
      path: myfifa.loans.all,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { loan: loan },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.loans.get,
      pathData: { loanId: payload.id },
      token: rootState.token,
      data: { loan: payload },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      }
    })
  },
  delete ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.loans.get,
      pathData: { loanId: payload },
      token: rootState.token,
      success: ({ data }) => {
        commit('remove', data)
      }
    })
  }
}
