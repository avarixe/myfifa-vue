import { crud, http, routes } from '@/api'
import { Player } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Player,
    parent: 'team'
  }),
  ANALYZE ({ rootState }, { teamId, playerIds }) {
    return http({
      method: 'post',
      path: routes.analyze.players,
      pathData: { teamId },
      token: rootState.token,
      data: {
        query: {
          player_ids: playerIds
        }
      }
    })
  },
  RETIRE ({ rootState }, playerId) {
    return http({
      method: 'post',
      path: routes.players.retire,
      pathData: { playerId },
      token: rootState.token
    })
  },
  RELEASE ({ rootState }, playerId) {
    return http({
      method: 'post',
      path: routes.players.release,
      pathData: { playerId },
      token: rootState.token
    })
  }
}
