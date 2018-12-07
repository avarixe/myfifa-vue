import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class Substitution extends Model {
  static entity = 'substitutions'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      match_id: this.number(0),
      player_id: this.number(0),
      replacement_id: this.number(0),

      // Database fields
      player_name: this.string(''),
      replaced_by: this.string(''),
      minute: this.number(0),
      injury: this.boolean(false),

      // Calculated fields
      event_type: this.string('Substitution'),
      home: this.boolean(true),

      // Associations
      match: this.belongsTo(Match, 'match_id'),
      player: this.belongsTo(Player, 'player_id'),
      replacement: this.belongsTo(Player, 'replacement_id')
    }
  }
}
