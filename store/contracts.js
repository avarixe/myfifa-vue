import { crud, http, routes } from '@/api'
import { Contract } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Contract,
    parent: 'player'
  }),
  SEARCH ({ rootState }, { teamId, filters }) {
    return http({
      method: 'post',
      path: routes.contracts.search,
      pathData: { teamId },
      data: { filters },
      token: rootState.token,
      success ({ data }) {
        Contract.insert({ data })
      }
    })
  }
}
