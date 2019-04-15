import http from '@/api'
import myfifa from '@/api/myfifa'
import { Substitution } from '@/models'

// actions
export const actions = {
  FETCH ({ rootState }, { matchId }) {
    return http({
      method: 'get',
      path: myfifa.substitutions.index,
      pathData: { matchId },
      token: rootState.token,
      success: function ({ data }) { Substitution.insert({ data }) }
    })
  },
  CREATE ({ rootState }, { matchId, substitution }) {
    return http({
      method: 'post',
      path: myfifa.substitutions.index,
      pathData: { matchId },
      token: rootState.token,
      data: { substitution }
    })
  },
  REMOVE ({ rootState }, substitutionId) {
    return http({
      method: 'delete',
      path: myfifa.substitutions.record,
      pathData: { substitutionId },
      token: rootState.token
    })
  }
}
