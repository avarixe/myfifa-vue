import { crud, http, routes } from '@/api'
import { Squad, SquadPlayer } from '@/models'

// actions
export const actions = {
  ...crud({
    model: Squad,
    parent: 'team'
  }),
  STORE_LINEUP ({ rootState }, { matchId, squadId }) {
    return http({
      method: 'post',
      path: routes.squads.storeLineup,
      pathData: { matchId, squadId },
      token: rootState.token,
      success ({ data }) {
        SquadPlayer.delete(player => player.squad_id === squadId)
        Squad.insert({ data })
      }
    })
  }
}
