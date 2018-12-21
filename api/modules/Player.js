import { Player } from '@/models'
import orderBy from 'lodash.orderby'

export function contractedPlayers (teamId) {
  return orderBy(
    Player
      .query()
      .where('team_id', teamId)
      .where('status', status => status)
      .get(),
    ['pos_idx', 'ovr'],
    ['asc', 'desc']
  )
}

export function activePlayers (teamId) {
  return contractedPlayers(teamId)
    .filter(player => player.status === 'Active')
}
