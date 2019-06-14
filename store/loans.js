import http from '@/api'
import myfifa from '@/api/myfifa'
import { crud } from '@/api/actions'
import { Loan } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Loan,
    route: 'loans',
    parentId: 'playerId',
    recordId: 'loanId',
    dataName: 'loan'
  }),
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.loans.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Loan.insert({ data })
      }
    })
  }
}
