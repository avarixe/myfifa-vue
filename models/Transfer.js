import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Transfer extends Model {
  static entity = 'transfers'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      player_id: this.attr(null),

      // Database fields
      signed_date: this.attr(null),
      effective_date: this.attr(null),
      origin: this.attr(''),
      destination: this.attr(''),
      fee: this.attr(null),
      traded_player: this.attr(null),
      addon_clause: this.attr(null),
      loan: this.attr(false),

      // Associations
      player: this.belongsTo(Player, 'player_id')
    }
  }
}
