import http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

export const actions = {
  getAll ({ commit, rootState }, { playerId }) {
    return http({
      path: myfifa.transfers.index,
      pathData: { playerId },
      token: rootState.token,
      success: ({ data }) => {
        commit('player/SET', {
          ...rootState.player.list[playerId],
          transfers: objectify(data)
        }, { root: true })
      }
    })
  },
  create ({ commit, rootState }, { playerId, transfer }) {
    return http({
      method: 'post',
      path: myfifa.transfers.index,
      pathData: { playerId },
      token: rootState.token,
      data: { transfer }
    })
  }
}
