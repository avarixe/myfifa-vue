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
  get ({ rootGetters }, { loanId }) {
    return apiRequest({
      path: myfifa.loans.get,
      pathData: { loanId: loanId },
      token: rootGetters['user/token'],
      errorMessage: 'Failed to retrieve Loan. Please try again.'
    })
  },
  create ({ commit, rootGetters }, { playerId, loan }) {
    return apiRequest({
      method: 'post',
      path: myfifa.loans.all,
      pathData: { playerId: playerId },
      token: rootGetters['user/token'],
      data: { loan: loan },
      errorMessage: 'Failed to create Loan. Please try again.'
    })
  },
  update ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.loans.get,
      pathData: { loanId: payload.id },
      token: rootGetters['user/token'],
      data: { loan: payload },
      errorMessage: 'Failed to update Loan. Please try again.'
    })
  },
  delete ({ commit, rootGetters }, payload) {
    return apiRequest({
      method: 'delete',
      path: myfifa.loans.get,
      pathData: { loanId: payload },
      token: rootGetters['user/token'],
      success: ({ data }) => {
        commit('remove', data)
      },
      errorMessage: 'Failed to delete Loan. Please try again.'
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
