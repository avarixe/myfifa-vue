import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

export const actions = {
  getAll ({ commit, rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.transfers.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      success: ({ data }) => {
        commit('player/SET', {
          ...rootState.player.list[playerId],
          transfers: data
        }, { root: true })
      }
    })
  },
  create ({ commit, rootState }, { playerId, transfer }) {
    return apiRequest({
      method: 'post',
      path: myfifa.transfers.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { transfer: transfer }
    })
  }
}
