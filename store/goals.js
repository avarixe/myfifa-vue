import { crud, http, routes } from '@/api'
import { Goal } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Goal,
    route: 'goals',
    parentId: 'matchId',
    recordId: 'goalId',
    dataName: 'goal'
  }),
  SEARCH ({ rootState }, { teamId }) {
    return http({
      method: 'post',
      path: routes.goals.search,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Goal.insert({ data })
      }
    })
  }
}
