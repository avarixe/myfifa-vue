import { Model } from '@vuex-orm/core'
import SquadPlayer from './SquadPlayer'
import Player from './Player'

export default class Squad extends Model {
  static entity = 'Squad'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      teamId: this.number(0),

      // Database fields
      name: this.string(''),

      // Associations
      squad_players: this.hasMany(SquadPlayer, 'squad_id'),
      players: this.belongsToMany(Player, SquadPlayer, 'squad_id', 'player_id')
    }
  }
}
