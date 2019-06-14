import http from '@/api'
import myfifa from '@/api/myfifa'
import { crud } from '@/api/actions'
import { Transfer } from '@/models'

export const actions = {
  ...crud({
    model: Transfer,
    route: 'transfers',
    parentId: 'playerId',
    recordId: 'transferId',
    dataName: 'transfer'
  }),
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.transfers.teamIndex,
      pathData: { teamId },
      token: rootState.token,
      success ({ data }) {
        Transfer.insert({ data })
      }
    })
  }
}
