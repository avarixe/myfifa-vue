import $_http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

export const actions = {
  getAll ({ commit, rootState }, { playerId }) {
    return $_http({
      path: myfifa.transfers.index,
      pathData: { playerId: playerId },
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
    return $_http({
      method: 'post',
      path: myfifa.transfers.index,
      pathData: { playerId: playerId },
      token: rootState.token,
      data: { transfer: transfer }
    })
  }
}
