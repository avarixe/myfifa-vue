import http from '@/api'
import myfifa from '@/api/myfifa'
import { crud } from '@/api/actions'
import { Injury } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Injury,
    route: 'injuries',
    parentId: 'playerId',
    recordId: 'injuryId',
    dataName: 'injury'
  }),
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.injuries.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Injury.insert({ data })
      }
    })
  }
}
