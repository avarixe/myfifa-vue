import { crud, http, routes } from '@/api'
import { Transfer } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Transfer,
    parent: 'player'
  }),
  SEARCH ({ rootState }, { teamId, filters }) {
    return http({
      methods: 'post',
      path: routes.transfers.search,
      pathData: { teamId },
      data: { filters },
      token: rootState.token,
      success ({ data }) {
        Transfer.insert({ data })
      }
    })
  }
}
