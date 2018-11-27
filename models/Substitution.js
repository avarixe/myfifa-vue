import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class Substitution extends Model {
  static entity = 'substitutions'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      match_id: this.attr(null),
      player_id: this.attr(null),
      replacement_id: this.attr(null),

      // Database fields
      player_name: this.attr(''),
      replaced_by: this.attr(''),
      minute: this.attr(null),
      injury: this.attr(false),
      
      // Calculated fields
      event_type: this.attr('Substitution'),
      home: this.attr(true),

      // Associations
      match: this.belongsTo(Match, 'match_id'),
      player: this.belongsTo(Player, 'player_id'),
      replacement: this.belongsTo(Player, 'replacement_id')
    }
  }
}
