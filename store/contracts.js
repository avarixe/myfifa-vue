import { crud, http, routes } from '@/api'
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
    parentId: 'playerId',
    dataName: 'contract'
  }),
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: routes.contracts.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Contract.insert({ data })
      }
    })
  }
}
