import http from '@/api'
import myfifa from '@/api/myfifa'
import { crud } from '@/api/actions'
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
  ...crud({
    model: Contract,
    route: 'contracts',
    parentId: 'playerId',
    recordId: 'contractId',
    dataName: 'contract'
  }),
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.contracts.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Contract.insert({ data })
      }
    })
  }
}
