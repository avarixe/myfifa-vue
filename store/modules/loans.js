import http from '@/api'
import myfifa from '@/api/myfifa'
import { Loan } from '@/models'

// actions
const actions = {
  FETCH ({ rootState }, { playerId }) {
    return http({
      path: myfifa.loans.index,
      pathData: { playerId },
      token: rootState.session.token,
      success: ({ data }) => { Loan.insert({ data }) }
    })
  },
  CREATE ({ rootState }, { playerId, loan }) {
    return http({
      method: 'post',
      path: myfifa.loans.index,
      pathData: { playerId },
      token: rootState.session.token,
      data: { loan }
    })
  },
  UPDATE ({ commit, rootState }, loan) {
    return http({
      method: 'patch',
      path: myfifa.loans.record,
      pathData: { loanId: loan.id },
      token: rootState.session.token,
      data: { loan }
    })
  }
}

export default {
  namespaced: true,
  actions
}
