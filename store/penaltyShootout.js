import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  CREATE ({ rootState }, { matchId, penaltyShootout }) {
    return http({
      method: 'post',
      path: myfifa.matches.penaltyShootout,
      pathData: { matchId },
      token: rootState.token,
      data: { penalty_shootout: penaltyShootout }
    })
  },
  REMOVE ({ rootState }, matchId) {
    return http({
      method: 'delete',
      path: myfifa.matches.penaltyShootout,
      pathData: { matchId },
      token: rootState.token
    })
  }
}
