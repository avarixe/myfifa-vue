import http from '@/api'
import myfifa from '@/api/myfifa'
import { Stage } from '@/models'

// actions
export const actions = {
  FETCH ({ rootState }, { competitionId }) {
    return http({
      path: myfifa.stages.index,
      pathData: { competitionId },
      token: rootState.token,
      success: function ({ data }) { Stage.insert({ data }) }
    })
  },
  CREATE ({ rootState }, { competitionId, stage }) {
    return http({
      method: 'post',
      path: myfifa.stages.index,
      pathData: { competitionId },
      token: rootState.token,
      data: { stage }
    })
  },
  UPDATE ({ rootState }, stage) {
    return http({
      method: 'patch',
      path: myfifa.stages.record,
      pathData: { stageId: stage.id },
      token: rootState.token,
      data: { stage }
    })
  },
  REMOVE ({ rootState }, stageId) {
    return http({
      method: 'delete',
      path: myfifa.stages.record,
      pathData: { stageId },
      token: rootState.token
    })
  }
}
