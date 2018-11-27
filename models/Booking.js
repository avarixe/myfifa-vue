import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class Booking extends Model {
  static entity = 'bookings'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      match_id: this.attr(null),
      player_id: this.attr(null),

      // Database fields
      player_name: this.attr(''),
      minute: this.attr(null),
      red_card: this.attr(false),
      
      // Calculated fields
      event_type: this.attr('Booking'),
      home: this.attr(true),

      // Associations
      match: this.belongsTo(Match, 'match_id'),
      player: this.belongsTo(Player, 'player_id')
    }
  }
}
