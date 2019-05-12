import http from '@/api'
import myfifa from '@/api/myfifa'
import { Squad } from '@/models'

// actions
export const actions = {
  FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.squads.index,
      pathData: { teamId },
      token: rootState.token,
      success: function ({ data }) { Squad.insert({ data }) }
    })
  },
  GET ({ rootState }, { squadId }) {
    const squad = Squad.find(squadId)
    if (squad) {
      return { data: squad }
    } else {
      return http({
        path: myfifa.squads.record,
        pathData: { squadId },
        token: rootState.token,
        success: function ({ data }) { Squad.insert({ data }) }
      })
    }
  },
  CREATE ({ rootState }, { teamId, squad }) {
    return http({
      method: 'post',
      path: myfifa.squads.index,
      pathData: { teamId },
      token: rootState.token,
      data: { squad }
    })
  },
  UPDATE ({ rootState }, squad) {
    return http({
      method: 'patch',
      path: myfifa.squads.record,
      pathData: { squadId: squad.id },
      token: rootState.token,
      data: { squad }
    })
  },
  REMOVE ({ rootState }, squadId) {
    return http({
      method: 'delete',
      path: myfifa.squads.record,
      pathData: { squadId },
      token: rootState.token
    })
  }
}
