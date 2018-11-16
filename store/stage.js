import http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'
import { formatter } from '@/api/modules/stage'

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { competitionId }) {
    return http({
      path: myfifa.stages.index,
      pathData: { competitionId },
      token: rootState.token,
      success: function ({ data }) {
        commit('competition/SET', {
          ...rootState.competition.list[competitionId],
          stages: objectify(data, {
            itemFormatter: formatter
          })
        }, { root: true })
      }
    })
  },
  create ({ commit, rootState }, { competitionId, stage }) {
    return http({
      method: 'post',
      path: myfifa.stages.index,
      pathData: { competitionId },
      token: rootState.token,
      data: { stage }
    })
  },
  update ({ commit, rootState }, stage) {
    return http({
      method: 'patch',
      path: myfifa.stages.record,
      pathData: { stageId: stage.id },
      token: rootState.token,
      data: { stage }
    })
  },
  remove ({ commit, rootState }, stageId) {
    return http({
      method: 'delete',
      path: myfifa.stages.record,
      pathData: { stageId },
      token: rootState.token
    })
  }
}
