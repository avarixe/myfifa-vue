import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  get ({ rootState }, { loanId }) {
    return apiRequest({
      path: myfifa.loans.get,
      pathData: { loanId: loanId },
      token: rootState.user.token,
      errorMessage: 'Failed to retrieve Loan. Please try again.'
    })
  },
  create ({ commit, rootState }, { playerId, loan }) {
    return apiRequest({
      method: 'post',
      path: myfifa.loans.all,
      pathData: { playerId: playerId },
      token: rootState.user.token,
      data: { loan: loan },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      },
      errorMessage: 'Failed to create Loan. Please try again.'
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.loans.get,
      pathData: { loanId: payload.id },
      token: rootState.user.token,
      data: { loan: payload },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
      },
      errorMessage: 'Failed to update Loan. Please try again.'
    })
  },
  delete ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.loans.get,
      pathData: { loanId: payload },
      token: rootState.user.token,
      success: ({ data }) => {
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Loan. Please try again.'
    })
  }
}
