import http from '@/api'
import myfifa from '@/api/myfifa'
import { Contract } from '@/models'

// initial state
const state = () => ({
  bonusRequirementTypes: [
    'Appearances',
    'Goals',
    'Assists',
    'Clean Sheets'
  ]
})

// actions
const actions = {
  FETCH ({ rootState }, { playerId }) {
    return http({
      path: myfifa.contracts.index,
      pathData: { playerId },
      token: rootState.session.token,
      success: ({ data }) => { Contract.insert({ data }) }
    })
  },
  CREATE ({ commit, rootState }, { playerId, contract }) {
    return http({
      method: 'post',
      path: myfifa.contracts.index,
      pathData: { playerId },
      token: rootState.session.token,
      data: { contract }
    })
  },
  UPDATE ({ commit, rootState }, contract) {
    return http({
      method: 'patch',
      path: myfifa.contracts.record,
      pathData: { contractId: contract.id },
      token: rootState.session.token,
      data: { contract }
    })
  }
}

export default {
  namespaced: true,
  state,
  actions
}
