import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, penaltyShootout }) {
    return apiRequest({
      method: 'post',
      path: myfifa.penaltyShootouts.index,
      pathData: { matchId: matchId },
      token: rootState.token,
      data: { penalty_shootout: penaltyShootout }
    })
  },
  remove ({ commit, rootState }, penaltyShootoutId) {
    return apiRequest({
      method: 'delete',
      path: myfifa.penaltyShootouts.record,
      pathData: { penaltyShootoutId: penaltyShootoutId },
      token: rootState.token
    })
  }
}
