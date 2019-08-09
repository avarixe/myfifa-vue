import { crud, http, routes } from '@/api'
import { Injury } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Injury,
    parent: 'player'
  }),
  SEARCH ({ rootState }, { teamId, filters }) {
    return http({
      method: 'post',
      path: routes.injuries.search,
      pathData: { teamId },
      data: { filters },
      token: rootState.token,
      success ({ data }) {
        Injury.insert({ data })
      }
    })
  }
}
