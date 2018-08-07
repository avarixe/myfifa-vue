import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  getAll ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.loans.index,
      pathData: { playerId: playerId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { playerId, loan }) {
    return apiRequest({
      method: 'post',
      path: myfifa.loans.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { loan: loan },
      success: ({ data }) => {
        commit('player/set', data, { root: true })
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.loans.record,
      pathData: { loanId: payload.id },
      token: rootState.token,
      data: { loan: payload },
      success: ({ data }) => {
        commit('player/set', data, { root: true })
      }
    })
  }
}
