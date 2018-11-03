import $_http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

// actions
export const actions = {
  getAll ({ commit, rootState }, { playerId }) {
    return $_http({
      path: myfifa.injuries.index,
      pathData: { playerId },
      token: rootState.token,
      success: ({ data }) => {
        commit('player/SET', {
          ...rootState.player.list[playerId],
          injuries: objectify(data)
        }, { root: true })
      }
    })
  },
  create ({ commit, rootState }, { playerId, injury }) {
    return $_http({
      method: 'post',
      path: myfifa.injuries.index,
      pathData: { playerId },
      token: rootState.token,
      data: { injury }
    })
  },
  update ({ commit, rootState }, injury) {
    return $_http({
      method: 'patch',
      path: myfifa.injuries.record,
      pathData: { injuryId: injury.id },
      token: rootState.token,
      data: { injury }
    })
  }
}
