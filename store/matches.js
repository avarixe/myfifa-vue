import { crud, http, routes } from '@/api'
import { Match } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Match,
    parent: 'team'
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
