import $_http from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, goal }) {
    return $_http({
      method: 'post',
      path: myfifa.goals.index,
      pathData: { matchId },
      token: rootState.token,
      data: { goal }
    })
  },
  remove ({ commit, rootState }, goalId) {
    return $_http({
      method: 'delete',
      path: myfifa.goals.record,
      pathData: { goalId },
      token: rootState.token
    })
  }
}
