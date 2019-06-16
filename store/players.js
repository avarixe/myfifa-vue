import { crud, http, routes } from '@/api'
import { Player, PlayerHistory } from '@/models'

// initial state
export const state = () => ({
  positions: [
    'GK',
    'RB',
    'RWB',
    'CB',
    'LB',
    'LWB',
    'RM',
    'CDM',
    'CM',
    'CAM',
    'LM',
    'RW',
    'CF',
    'ST',
    'LW'
  ]
})

// actions
export const actions = {
  ...crud({
    model: Player,
    parentId: 'teamId',
    dataName: 'player'
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
  },
  GET_HISTORY ({ rootState }, { playerId }) {
    return http({
      path: routes.players.history,
      pathData: { playerId },
      token: rootState.token,
      success ({ data }) {
        PlayerHistory.insert({ data })
      }
    })
  },
  GET_CURRENT_INJURY ({ rootState }, { playerId }) {
    return http({
      path: routes.players.currentInjury,
      pathData: { playerId },
      token: rootState.token
    })
  },
  GET_CURRENT_LOAN ({ rootState }, { playerId }) {
    return http({
      path: routes.players.currentLoan,
      pathData: { playerId },
      token: rootState.token
    })
  }
}
