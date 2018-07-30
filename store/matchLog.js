import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  getAll ({ state, commit, rootState }, { matchId }) {
    return apiRequest({
      path: myfifa.matchLogs.index,
      pathData: { matchId: matchId },
      token: rootState.token,
      success: ({ data }) => {
        commit('match/set', {
          ...rootState.match.list[matchId],
          match_logs: data
        }, { root: true })
      }
    })
  },
  get ({ rootState }, { logId }) {
    return apiRequest({
      path: myfifa.matchLogs.record,
      pathData: { logId: logId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { matchId, matchLog }) {
    return apiRequest({
      method: 'post',
      path: myfifa.matchLogs.index,
      pathData: { matchId: matchId },
      token: rootState.token,
      data: { match_log: matchLog },
      success: ({ data }) => {
        commit('match/setLog', data, { root: true })
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.matchLogs.record,
      pathData: { logId: payload.id },
      token: rootState.token,
      data: { match_log: payload },
      success: ({ data }) => {
        commit('match/setLog', data, { root: true })
      }
    })
  }
}
