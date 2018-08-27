import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, goal }) {
    return apiRequest({
      method: 'post',
      path: myfifa.goals.index,
      pathData: { matchId: matchId },
      token: rootState.token,
      data: { goal: goal },
      success: ({ data }) => {
        commit('match/SET', data, { root: true })
      }
    })
  },
  remove ({ commit, rootState }, goalId) {
    return apiRequest({
      method: 'delete',
      path: myfifa.goals.record,
      pathData: { goalId: goalId },
      token: rootState.token,
      success: ({ data }) => {
        commit('match/SET', data, { root: true })
      }
    })
  }
}
