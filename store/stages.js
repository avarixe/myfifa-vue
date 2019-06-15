import { crud, http, routes } from '@/api'
import { Stage } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Stage,
    route: 'stages',
    parentId: 'competitionId',
    recordId: 'stageId',
    dataName: 'stage'
  }),
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: routes.stages.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Stage.insert({ data })
      }
    })
  }
}
