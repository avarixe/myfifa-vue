import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Goal extends Model {
  static get entity () {
    return 'goals'
  }

  static get title () {
    return 'Goal'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      match_id: this.number(0),
      player_id: this.number(null).nullable(),
      assist_id: this.number(null).nullable(),

      // Database fields
      player_name: this.string(''),
      assisted_by: this.string('').nullable(),
      minute: this.number(0),
      home: this.boolean(true),
      own_goal: this.boolean(false),
      penalty: this.boolean(false),
      created_at: this.string(''),

      // Calculated fields
      event_type: this.string('Goal'),

      // Associations
      player: this.belongsTo(Player, 'player_id', 'id'),
      assisting_player: this.belongsTo(Player, 'assist_id', 'id')
    }
  }
}
