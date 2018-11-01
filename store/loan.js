import $_http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

// actions
export const actions = {
  getAll ({ commit, rootState }, { playerId }) {
    return $_http({
      path: myfifa.loans.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      success: ({ data }) => {
        commit('player/SET', {
          ...rootState.player.list[playerId],
          loans: objectify(data)
        }, { root: true })
      }
    })
  },
  create ({ commit, rootState }, { playerId, loan }) {
    return $_http({
      method: 'post',
      path: myfifa.loans.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { loan: loan }
    })
  },
  update ({ commit, rootState }, payload) {
    return $_http({
      method: 'patch',
      path: myfifa.loans.record,
      pathData: { loanId: payload.id },
      token: rootState.token,
      data: { loan: payload }
    })
  }
}
