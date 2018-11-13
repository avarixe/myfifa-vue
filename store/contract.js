import http from '@/api'
import myfifa from '@/api/myfifa'
import objectify from '@/plugins/objectify'

// initial state
export const state = () => ({
  bonusRequirementTypes: [
    'Appearances',
    'Goals',
    'Assists',
    'Clean Sheets'
  ]
})

// actions
export const actions = {
  getAll ({ commit, rootState }, { playerId }) {
    return http({
      path: myfifa.contracts.index,
      pathData: { playerId },
      token: rootState.token,
      success: ({ data }) => {
        commit('player/SET', {
          ...rootState.player.list[playerId],
          contracts: objectify(data)
        }, { root: true })
      }
    })
  },
  create ({ commit, rootState }, { playerId, contract }) {
    return http({
      method: 'post',
      path: myfifa.contracts.index,
      pathData: { playerId },
      token: rootState.token,
      data: { contract }
    })
  },
  update ({ commit, rootState }, contract) {
    return http({
      method: 'patch',
      path: myfifa.contracts.record,
      pathData: { contractId: contract.id },
      token: rootState.token,
      data: { contract }
    })
  }
}
