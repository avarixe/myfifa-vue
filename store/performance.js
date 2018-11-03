import $_http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

// actions
export const actions = {
  getAll ({ commit, rootState }, { matchId }) {
    return $_http({
      path: myfifa.performances.index,
      pathData: { matchId },
      token: rootState.token,
      success: ({ data }) => {
        commit('match/SET', {
          ...rootState.match.list[matchId],
          performances: objectify(data)
        }, { root: true })
      }
    })
  },
  get ({ rootState }, { performanceId }) {
    return $_http({
      path: myfifa.performances.record,
      pathData: { performanceId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { matchId, performance }) {
    return $_http({
      method: 'post',
      path: myfifa.performances.index,
      pathData: { matchId },
      token: rootState.token,
      data: { performance }
    })
  },
  update ({ commit, rootState }, performance) {
    return $_http({
      method: 'patch',
      path: myfifa.performances.record,
      pathData: { performanceId: performance.id },
      token: rootState.token,
      data: { performance }
    })
  }
}
