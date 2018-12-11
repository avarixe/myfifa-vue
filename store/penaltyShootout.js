import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, penaltyShootout }) {
    return http({
      method: 'post',
      path: myfifa.matches.penaltyShootout,
      pathData: { matchId },
      token: rootState.session.token,
      data: { penalty_shootout: penaltyShootout }
    })
  },
  remove ({ commit, rootState }, matchId) {
    return http({
      method: 'delete',
      path: myfifa.matches.penaltyShootout,
      pathData: { matchId },
      token: rootState.session.token
    })
  }
}
