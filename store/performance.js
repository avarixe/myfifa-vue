import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { matchId }) {
    return apiRequest({
      path: myfifa.performances.index,
      pathData: { matchId: matchId },
      token: rootState.token,
      success: ({ data }) => {
        commit('match/set', {
          ...rootState.match.list[matchId],
          performances: data
        }, { root: true })
      }
    })
  },
  get ({ rootState }, { performanceId }) {
    return apiRequest({
      path: myfifa.performances.record,
      pathData: { performanceId: performanceId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { matchId, performance }) {
    return apiRequest({
      method: 'post',
      path: myfifa.performances.index,
      pathData: { matchId: matchId },
      token: rootState.token,
      data: { performance: performance },
      success: ({ data }) => {
        commit('match/setPerformance', data, { root: true })
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.performances.record,
      pathData: { performanceId: payload.id },
      token: rootState.token,
      data: { performance: payload },
      success: ({ data }) => {
        commit('match/setPerformance', data, { root: true })
      }
    })
  }
}
