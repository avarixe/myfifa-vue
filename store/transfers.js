import { crud, http, routes } from '@/api'
import { Transfer } from '@/models'

export const actions = {
  ...crud({
    model: Transfer,
    parent: 'player',
    dataName: 'transfer'
  }),
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: routes.transfers.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Transfer.insert({ data })
      }
    })
  }
}
