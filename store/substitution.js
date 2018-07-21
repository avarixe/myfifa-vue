import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { matchId, substitution }) {
    return apiRequest({
      method: 'post',
      path: myfifa.subs.index,
      pathData: { matchId: matchId },
      token: rootState.token,
      data: { substitution: substitution },
      success: ({ data }) => {
        commit('match/set', data, { root: true })
      }
    })
  },
  remove ({ commit, rootState }, { subId }) {
    return apiRequest({
      method: 'patch',
      path: myfifa.subs.record,
      pathData: { subId: subId },
      token: rootState.token,
      success: ({ data }) => {
        commit('match/set', data, { root: true })
      }
    })
  }
}
