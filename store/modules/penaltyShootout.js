import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
const actions = {
  CREATE ({ rootState }, { matchId, penaltyShootout }) {
    return http({
      method: 'post',
      path: myfifa.matches.penaltyShootout,
      pathData: { matchId },
      token: rootState.session.token,
      data: { penalty_shootout: penaltyShootout }
    })
  },
  REMOVE ({ rootState }, matchId) {
    return http({
      method: 'delete',
      path: myfifa.matches.penaltyShootout,
      pathData: { matchId },
      token: rootState.session.token
    })
  }
}

export default {
  namespaced: true,
  actions
}
