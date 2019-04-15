import http from '@/api'
import myfifa from '@/api/myfifa'
import { Contract } from '@/models'

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
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.contracts.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success: ({ data }) => { Contract.insert({ data }) }
    })
  },
  FETCH ({ rootState }, { playerId }) {
    return http({
      path: myfifa.contracts.index,
      pathData: { playerId },
      token: rootState.token,
      success: ({ data }) => { Contract.insert({ data }) }
    })
  },
  CREATE ({ commit, rootState }, { playerId, contract }) {
    return http({
      method: 'post',
      path: myfifa.contracts.index,
      pathData: { playerId },
      token: rootState.token,
      data: { contract }
    })
  },
  UPDATE ({ commit, rootState }, contract) {
    return http({
      method: 'patch',
      path: myfifa.contracts.record,
      pathData: { contractId: contract.id },
      token: rootState.token,
      data: { contract }
    })
  }
}
