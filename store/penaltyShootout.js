import { http, routes } from '@/api'

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
  REMOVE ({ rootState }, matchId) {
    return http({
      method: 'delete',
      path: routes.matches.penaltyShootout,
      pathData: { matchId },
      token: rootState.token
    })
  }
}
