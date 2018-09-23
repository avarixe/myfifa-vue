import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  getAll ({ commit, rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.loans.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      success: ({ data }) => {
        commit('player/SET', {
          ...rootState.player.list[playerId],
          loans: data
        }, { root: true })
      }
    })
  },
  create ({ commit, rootState }, { playerId, loan }) {
    return apiRequest({
      method: 'post',
      path: myfifa.loans.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { loan: loan }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.loans.record,
      pathData: { loanId: payload.id },
      token: rootState.token,
      data: { loan: payload }
    })
  }
}
