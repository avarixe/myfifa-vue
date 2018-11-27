import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class Cap extends Model {
  static entity = 'caps'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      match_id: this.number(0),
      player_id: this.number(0),

      // Database fields
      pos: this.string(''),
      start: this.number(0),
      stop: this.number(90),
      subbed_out: this.boolean(false),

      // Calculated fields
      name: this.string(''),

      // Associations
      match: this.belongsTo(Match, 'match_id'),
      player: this.belongsTo(Player, 'player_id')
    }
  }
}
