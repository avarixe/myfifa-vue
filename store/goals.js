import http from '@/api'
import myfifa from '@/api/myfifa'
import { Goal } from '@/models'

// actions
export const actions = {
  FETCH ({ rootState }, { matchId }) {
    return http({
      method: 'get',
      path: myfifa.goals.index,
      pathData: { matchId },
      token: rootState.token,
      success: function ({ data }) { Goal.insert({ data }) }
    })
  },
  CREATE ({ rootState }, { matchId, goal }) {
    return http({
      method: 'post',
      path: myfifa.goals.index,
      pathData: { matchId },
      token: rootState.token,
      data: { goal }
    })
  },
  REMOVE ({ rootState }, goalId) {
    return http({
      method: 'delete',
      path: myfifa.goals.record,
      pathData: { goalId },
      token: rootState.token
    })
  }
}
