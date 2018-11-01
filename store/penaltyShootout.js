import Vue from 'vue'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, penaltyShootout }) {
    return $_http({
      method: 'post',
      path: myfifa.penaltyShootouts.index,
      pathData: { matchId: matchId },
      token: rootState.token,
      data: { penalty_shootout: penaltyShootout }
    })
  },
  remove ({ commit, rootState }, penaltyShootoutId) {
    return $_http({
      method: 'delete',
      path: myfifa.penaltyShootouts.record,
      pathData: { penaltyShootoutId: penaltyShootoutId },
      token: rootState.token
    })
  }
}
