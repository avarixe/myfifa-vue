import http from '@/api'
import myfifa from '@/api/myfifa'
import { Injury } from '@/models'

// actions
export const actions = {
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.injuries.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success: ({ data }) => { Injury.insert({ data }) }
    })
  },
  FETCH ({ rootState }, { playerId }) {
    return http({
      path: myfifa.injuries.index,
      pathData: { playerId },
      token: rootState.token,
      success: ({ data }) => { Injury.insert({ data }) }
    })
  },
  CREATE ({ rootState }, { playerId, injury }) {
    return http({
      method: 'post',
      path: myfifa.injuries.index,
      pathData: { playerId },
      token: rootState.token,
      data: { injury }
    })
  },
  UPDATE ({ rootState }, injury) {
    return http({
      method: 'patch',
      path: myfifa.injuries.record,
      pathData: { injuryId: injury.id },
      token: rootState.token,
      data: { injury }
    })
  }
}
