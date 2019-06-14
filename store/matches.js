import http from '@/api'
import myfifa from '@/api/myfifa'
import { crud } from '@/api/actions'
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
  ...crud({
    model: Match,
    route: 'matches',
    parentId: 'teamId',
    recordId: 'matchId',
    dataName: 'match'
  }),
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
