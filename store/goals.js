import { crud, http, routes } from '@/api'
import { Goal } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Goal,
    parent: 'match'
  }),
  SEARCH ({ rootState }, { teamId, filters }) {
    return http({
      method: 'post',
      path: routes.goals.search,
      pathData: { teamId },
      data: { filters },
      token: rootState.token,
      success ({ data }) {
        Goal.insert({ data })
      }
    })
  }
}
