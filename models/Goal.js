import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class Goal extends Model {
  static entity = 'goals'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      match_id: this.attr(null),
      player_id: this.attr(null),
      assist_id: this.attr(null),

      // Database fields
      player_name: this.attr(''),
      assisted_by: this.attr(''),
      home: this.attr(true),
      own_goal: this.attr(false),
      penalty: this.attr(false),
      
      // Calculated fields
      event_type: this.attr('Goal'),

      // Associations
      match: this.belongsTo(Match, 'match_id'),
      player: this.belongsTo(Player, 'player_id'),
      assisting_player: this.belongsTo(Player, 'assist_id')
    }
  }
}
