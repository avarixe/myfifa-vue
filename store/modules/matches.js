import http from '@/api'
import myfifa from '@/api/myfifa'
import { Match } from '@/models'

// initial state
const state = () => ({
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

// getters
const getters = {
  allByRecency: (state, getters, rootState) => {
    return Match
      .query()
      .where('team_id', rootState.entities.teams.currentId)
      .orderBy('date_played', 'desc')
      .get()
  },
  competitions: (state, getters) => [
    ...new Set(getters.allByRecency.map(match => match.competition))
  ],
  teams: (state, getters) => [
    ...new Set([
      ...getters.allByRecency.map(match => match.home),
      ...getters.allByRecency.map(match => match.away)
    ])
  ]
}

// actions
const actions = {
  FETCH ({ rootState }, { teamId }) {
    return http({
      path: myfifa.matches.index,
      pathData: { teamId },
      token: rootState.session.token,
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
        token: rootState.session.token,
        success: function ({ data }) { Match.insert({ data }) }
      })
    }
  },
  CREATE ({ rootState }, { teamId, match }) {
    return http({
      method: 'post',
      path: myfifa.matches.index,
      pathData: { teamId },
      token: rootState.session.token,
      data: { match }
    })
  },
  UPDATE ({ rootState }, match) {
    return http({
      method: 'patch',
      path: myfifa.matches.record,
      pathData: { matchId: match.id },
      token: rootState.session.token,
      data: { match }
    })
  },
  REMOVE ({ rootState }, matchId) {
    return http({
      method: 'delete',
      path: myfifa.matches.record,
      pathData: { matchId },
      token: rootState.session.token
    })
  },
  APPLY_SQUAD ({ rootState }, { matchId, squadId }) {
    return http({
      method: 'post',
      path: myfifa.matches.applySquad,
      pathData: { matchId },
      token: rootState.session.token,
      data: { squad_id: squadId }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
