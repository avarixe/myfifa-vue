import http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

// actions
export const actions = {
  getAll ({ commit, rootState }, { matchId }) {
    return http({
      path: myfifa.caps.index,
      pathData: { matchId },
      token: rootState.session.token,
      success: ({ data }) => {
        commit('match/SET', {
          ...rootState.match.list[matchId],
          caps: objectify(data)
        }, { root: true })
      }
    })
  },
  get ({ rootState }, { capId }) {
    return http({
      path: myfifa.caps.record,
      pathData: { capId },
      token: rootState.session.token
    })
  },
  create ({ commit, rootState }, { matchId, cap }) {
    return http({
      method: 'post',
      path: myfifa.caps.index,
      pathData: { matchId },
      token: rootState.session.token,
      data: { cap }
    })
  },
  update ({ commit, rootState }, cap) {
    return http({
      method: 'patch',
      path: myfifa.caps.record,
      pathData: { capId: cap.id },
      token: rootState.session.token,
      data: { cap }
    })
  }
}
