import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

// actions
export const actions = {
  // get ({ rootState }, { injuryId }) {
  //   return apiRequest({
  //     path: myfifa.injuries.get,
  //     pathData: { injuryId: injuryId },
  //     token: rootState.token
  //   })
  // },
  create ({ commit, rootState }, { playerId, injury }) {
    return apiRequest({
      method: 'post',
      path: myfifa.injuries.all,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { injury: injury },
      success: ({ data }) => {
        commit('player/update', data, { root: true })
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
        commit('player/update', data, { root: true })
      }
    })
  }
  // delete ({ commit, rootState }, payload) {
  //   return apiRequest({
  //     method: 'delete',
  //     path: myfifa.injuries.get,
  //     pathData: { injuryId: payload },
  //     token: rootState.token,
  //     success: ({ data }) => {
  //       commit('remove', data)
  //     }
  //   })
  // }
}
