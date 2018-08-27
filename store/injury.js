import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  getAll ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.injuries.index,
      pathData: { playerId: playerId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { playerId, injury }) {
    return apiRequest({
      method: 'post',
      path: myfifa.injuries.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { injury: injury },
      success: ({ data }) => {
        commit('player/SET', data, { root: true })
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.injuries.record,
      pathData: { injuryId: payload.id },
      token: rootState.token,
      data: { injury: payload },
      success: ({ data }) => {
        commit('player/SET', data, { root: true })
      }
    })
  }
}
