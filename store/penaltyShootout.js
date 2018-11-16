import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, penaltyShootout }) {
    return http({
      method: 'post',
      path: myfifa.penaltyShootouts.index,
      pathData: { matchId },
      token: rootState.token,
      data: { penalty_shootout: penaltyShootout }
    })
  },
  remove ({ commit, rootState }, penaltyShootoutId) {
    return http({
      method: 'delete',
      path: myfifa.penaltyShootouts.record,
      pathData: { penaltyShootoutId },
      token: rootState.token
    })
  }
}
