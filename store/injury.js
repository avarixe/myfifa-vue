import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  create ({ commit, rootState }, { playerId, injury }) {
    return apiRequest({
      method: 'post',
      path: myfifa.injuries.all,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { injury: injury },
      success: ({ data }) => {
        commit('player/set', data, { root: true })
      }
    })
  },
  update ({ commit, rootState }, payload) {
    return apiRequest({
      method: 'patch',
      path: myfifa.injuries.get,
      pathData: { injuryId: payload.id },
      token: rootState.token,
      data: { injury: payload },
      success: ({ data }) => {
        commit('player/set', data, { root: true })
      }
    })
  }
}
