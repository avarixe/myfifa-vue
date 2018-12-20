import http from '@/api'
import myfifa from '@/api/myfifa'
import { Transfer } from '@/models'

const actions = {
  TEAM_FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.transfers.teamIndex,
      pathData: { teamId },
      token: rootState.session.token,
      success: ({ data }) => { Transfer.insert({ data }) }
    })
  },
  FETCH ({ rootState }, { playerId }) {
    return http({
      path: myfifa.transfers.index,
      pathData: { playerId },
      token: rootState.session.token,
      success: ({ data }) => { Transfer.insert({ data }) }
    })
  },
  CREATE ({ rootState }, { playerId, transfer }) {
    return http({
      method: 'post',
      path: myfifa.transfers.index,
      pathData: { playerId },
      token: rootState.session.token,
      data: { transfer }
    })
  }
}

export default {
  namespaced: true,
  actions
}
