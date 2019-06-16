import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class Booking extends Model {
  static get entity () {
    return 'bookings'
  }

  static get title () {
    return 'Booking'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      match_id: this.number(0),
      player_id: this.number(0),

      // Database fields
      player_name: this.string(''),
      minute: this.number(0),
      red_card: this.boolean(false),

      // Calculated fields
      event_type: this.string('Booking'),
      home: this.boolean(true),

      // Associations
      match: this.belongsTo(Match, 'match_id'),
      player: this.belongsTo(Player, 'player_id')
    }
  }
}
