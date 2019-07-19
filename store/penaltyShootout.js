import { http, routes } from '@/api'
import { PenaltyShootout } from '@/models'

// actions
export const actions = {
  CREATE ({ rootState }, { matchId, penaltyShootout }) {
    return http({
      method: 'post',
      path: routes.matches.penaltyShootout,
      pathData: { matchId },
      token: rootState.token,
      data: { penalty_shootout: penaltyShootout }
    })
  },
  REMOVE ({ rootState }, id) {
    const ps = PenaltyShootout.find(id)
    return http({
      method: 'delete',
      path: routes.matches.penaltyShootout,
      pathData: { matchId: ps.match_id },
      token: rootState.token
    })
  }
}
