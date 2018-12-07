import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class Goal extends Model {
  static entity = 'goals'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      match_id: this.number(0),
      player_id: this.number(null).nullable(),
      assist_id: this.number(null).nullable(),

      // Database fields
      player_name: this.string(''),
      assisted_by: this.string(''),
      home: this.boolean(true),
      own_goal: this.boolean(false),
      penalty: this.boolean(false),

      // Calculated fields
      event_type: this.string('Goal'),

      // Associations
      match: this.belongsTo(Match, 'match_id'),
      player: this.belongsTo(Player, 'player_id'),
      assisting_player: this.belongsTo(Player, 'assist_id')
    }
  }
}