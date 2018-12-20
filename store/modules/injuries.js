import http from '@/api'
import myfifa from '@/api/myfifa'
import { Injury } from '@/models'

// actions
const actions = {
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.injuries.teamIndex,
      pathData: { teamId },
      token: rootState.session.token,
      success: ({ data }) => { Injury.insert({ data }) }
    })
  },
  FETCH ({ rootState }, { playerId }) {
    return http({
      path: myfifa.injuries.index,
      pathData: { playerId },
      token: rootState.session.token,
      success: ({ data }) => { Injury.insert({ data }) }
    })
  },
  CREATE ({ rootState }, { playerId, injury }) {
    return http({
      method: 'post',
      path: myfifa.injuries.index,
      pathData: { playerId },
      token: rootState.session.token,
      data: { injury }
    })
  },
  UPDATE ({ rootState }, injury) {
    return http({
      method: 'patch',
      path: myfifa.injuries.record,
      pathData: { injuryId: injury.id },
      token: rootState.session.token,
      data: { injury }
    })
  }
}

export default {
  namespaced: true,
  actions
}
