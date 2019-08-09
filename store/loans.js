import { crud, http, routes } from '@/api'
import { Loan } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Loan,
    parent: 'player'
  }),
  SEARCH ({ rootState }, { teamId, filters }) {
    return http({
      method: 'post',
      path: routes.loans.search,
      pathData: { teamId },
      data: { filters },
      token: rootState.token,
      success ({ data }) {
        Loan.insert({ data })
      }
    })
  }
}
