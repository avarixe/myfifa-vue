import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, substitution }) {
    return http({
      method: 'post',
      path: myfifa.substitutions.index,
      pathData: { matchId },
      token: rootState.token,
      data: { substitution }
    })
  },
  remove ({ commit, rootState }, substitutionId) {
    return http({
      method: 'delete',
      path: myfifa.substitutions.record,
      pathData: { substitutionId },
      token: rootState.token
    })
  }
}
