import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class PenaltyShootout extends Model {
  static entity = 'penaltyShootouts'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      match_id: this.number(0),

      // Database fields
      home_score: this.number(0),
      away_score: this.number(0),

      // Associations
      match: this.belongsTo(Match, 'match_id'),
      player: this.belongsTo(Player, 'player_id')
    }
  }
}
