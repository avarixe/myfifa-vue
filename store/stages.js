import { crud, http, routes } from '@/api'
import { Stage } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Stage,
    parent: 'competition'
  }),
  SEARCH ({ rootState }, { teamId, filters }) {
    return http({
      method: 'post',
      path: routes.stages.search,
      pathData: { teamId },
      data: { filters },
      token: rootState.token,
      success ({ data }) {
        Stage.insert({ data })
      }
    })
  }
}
