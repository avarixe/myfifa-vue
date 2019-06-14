import http from '@/api'
import myfifa from '@/api/myfifa'
import { crud } from '@/api/actions'
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
      path: myfifa.goals.search,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Goal.insert({ data })
      }
    })
  }
}
