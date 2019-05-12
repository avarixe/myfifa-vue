import http from '@/api'
import myfifa from '@/api/myfifa'
import { Loan } from '@/models'

// actions
export const actions = {
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.loans.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success: ({ data }) => { Loan.insert({ data }) }
    })
  },
  FETCH ({ rootState }, { playerId }) {
    return http({
      path: myfifa.loans.index,
      pathData: { playerId },
      token: rootState.token,
      success: ({ data }) => { Loan.insert({ data }) }
    })
  },
  CREATE ({ rootState }, { playerId, loan }) {
    return http({
      method: 'post',
      path: myfifa.loans.index,
      pathData: { playerId },
      token: rootState.token,
      data: { loan }
    })
  },
  UPDATE ({ commit, rootState }, loan) {
    return http({
      method: 'patch',
      path: myfifa.loans.record,
      pathData: { loanId: loan.id },
      token: rootState.token,
      data: { loan }
    })
  }
}
