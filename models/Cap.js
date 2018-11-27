import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class Cap extends Model {
  static entity = 'caps'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      match_id: this.attr(null),
      player_id: this.attr(null),

      // Database fields
      pos: this.attr(''),
      start: this.attr(0),
      stop: this.attr(90),
      subbed_out: this.attr(false),

      // Calculated fields
      name: this.attr(''),

      // Associations
      match: this.belongsTo(Match, 'match_id'),
      player: this.belongsTo(Player, 'player_id')
    }
  }
}
