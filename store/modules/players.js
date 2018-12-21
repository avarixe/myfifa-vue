import orderBy from 'lodash.orderby'
import http from '@/api'
import myfifa from '@/api/myfifa'
import { Player, PlayerHistory } from '@/models'

// initial state
const state = () => ({
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

// getters
const getters = {
  contracted: (state, getters, rootState) => (
    orderBy(
      Player
        .query()
        .where('team_id', rootState.entities.teams.currentId)
        .where('status', status => status)
        .get(),
      ['pos_idx', 'ovr'],
      ['asc', 'desc']
    )
  ),
  active: (state, getters) => (
    getters.contracted.filter(player => player.status === 'Active')
  )
}

// actions
export const actions = {
  FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.players.index,
      pathData: { teamId },
      token: rootState.session.token,
      success: function ({ data }) { Player.insert({ data }) }
    })
  },
  GET ({ rootState }, { playerId }) {
    const player = Player.find(playerId)
    if (player) {
      return { data: player }
    } else {
      return http({
        path: myfifa.players.record,
        pathData: { playerId },
        token: rootState.session.token,
        success: ({ data }) => { Player.insert({ data }) }
      })
    }
  },
  ANALYZE ({ rootState }, { teamId, playerIds }) {
    return http({
      method: 'post',
      path: myfifa.analyze.players,
      pathData: { teamId },
      token: rootState.session.token,
      data: {
        query: {
          player_ids: playerIds
        }
      }
    })
  },
  CREATE ({ rootState }, { teamId, player }) {
    return http({
      method: 'post',
      path: myfifa.players.index,
      pathData: { teamId },
      token: rootState.session.token,
      data: { player }
    })
  },
  UPDATE ({ rootState }, player) {
    return http({
      method: 'patch',
      path: myfifa.players.record,
      pathData: { playerId: player.id },
      token: rootState.session.token,
      data: { player }
    })
  },
  REMOVE ({ rootState }, playerId) {
    return http({
      method: 'delete',
      path: myfifa.players.record,
      pathData: { playerId },
      token: rootState.session.token
    })
  },
  RETIRE ({ rootState }, playerId) {
    return http({
      method: 'post',
      path: myfifa.players.retire,
      pathData: { playerId },
      token: rootState.session.token
    })
  },
  RELEASE ({ rootState }, playerId) {
    return http({
      method: 'post',
      path: myfifa.players.release,
      pathData: { playerId },
      token: rootState.session.token
    })
  },
  GET_HISTORY ({ rootState }, { playerId }) {
    return http({
      path: myfifa.players.history,
      pathData: { playerId },
      token: rootState.session.token,
      success: function ({ data }) { PlayerHistory.insert({ data }) }
    })
  },
  GET_CURRENT_INJURY ({ rootState }, { playerId }) {
    return http({
      path: myfifa.players.currentInjury,
      pathData: { playerId },
      token: rootState.session.token
    })
  },
  GET_CURRENT_LOAN ({ rootState }, { playerId }) {
    return http({
      path: myfifa.players.currentLoan,
      pathData: { playerId },
      token: rootState.session.token
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
