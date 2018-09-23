import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, substitution }) {
    return apiRequest({
      method: 'post',
      path: myfifa.substitutions.index,
      pathData: { matchId: matchId },
      token: rootState.token,
      data: { substitution: substitution }
    })
  },
  remove ({ commit, rootState }, substitutionId) {
    return apiRequest({
      method: 'delete',
      path: myfifa.substitutions.record,
      pathData: { substitutionId: substitutionId },
      token: rootState.token
    })
  }
}
