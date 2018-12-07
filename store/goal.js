import http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, goal }) {
    return http({
      method: 'post',
      path: myfifa.goals.index,
      pathData: { matchId },
      token: rootState.session.token,
      data: { goal }
    })
  },
  remove ({ commit, rootState }, goalId) {
    return http({
      method: 'delete',
      path: myfifa.goals.record,
      pathData: { goalId },
      token: rootState.session.token
    })
  }
}
