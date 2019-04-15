import http from '@/api'
import myfifa from '@/api/myfifa'
import { Match } from '@/models'

// initial state
export const state = () => ({
  positions: [
    'GK',
    'LB',
    'LWB',
    'LCB',
    'CB',
    'RCB',
    'RB',
    'RWB',
    'LM',
    'LDM',
    'LCM',
    'CDM',
    'CM',
    'RDM',
    'RCM',
    'RM',
    'LAM',
    'CAM',
    'RAM',
    'LW',
    'CF',
    'LS',
    'ST',
    'RS',
    'RW'
  ]
})

// actions
export const actions = {
  FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.matches.index,
      pathData: { teamId },
      token: rootState.token,
      success: function ({ data }) { Match.insert({ data }) }
    })
  },
  GET ({ rootState }, { matchId }) {
    const match = Match.find(matchId)
    if (match) {
      return { data: match }
    } else {
      return http({
        path: myfifa.matches.record,
        pathData: { matchId },
        token: rootState.token,
        success: function ({ data }) { Match.insert({ data }) }
      })
    }
  },
  CREATE ({ rootState }, { teamId, match }) {
    return http({
      method: 'post',
      path: myfifa.matches.index,
      pathData: { teamId },
      token: rootState.token,
      data: { match }
    })
  },
  UPDATE ({ rootState }, match) {
    return http({
      method: 'patch',
      path: myfifa.matches.record,
      pathData: { matchId: match.id },
      token: rootState.token,
      data: { match }
    })
  },
  REMOVE ({ rootState }, matchId) {
    return http({
      method: 'delete',
      path: myfifa.matches.record,
      pathData: { matchId },
      token: rootState.token
    })
  },
  APPLY_SQUAD ({ rootState }, { matchId, squadId }) {
    return http({
      method: 'post',
      path: myfifa.matches.applySquad,
      pathData: { matchId },
      token: rootState.token,
      data: { squad_id: squadId }
    })
  }
}
