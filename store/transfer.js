import apiRequest from '@/api'
import myfifa from '@/api/myfifa'

export const actions = {
  getAll ({ rootState }, { playerId }) {
    return apiRequest({
      path: myfifa.transfers.index,
      pathData: { playerId: playerId },
      token: rootState.token
    })
  },
  create ({ commit, rootState }, { playerId, transfer }) {
    return apiRequest({
      method: 'post',
      path: myfifa.transfers.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { transfer: transfer },
      success: ({ data }) => {
        commit('player/set', data, { root: true })
      }
    })
  }
}
