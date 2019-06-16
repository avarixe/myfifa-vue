import { crud, http, routes } from '@/api'
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
    parent: 'team',
    dataName: 'match'
  }),
  APPLY_SQUAD ({ rootState }, { matchId, squadId }) {
    return http({
      method: 'post',
      path: routes.matches.applySquad,
      pathData: { matchId },
      token: rootState.token,
      data: { squad_id: squadId }
    })
  }
}
