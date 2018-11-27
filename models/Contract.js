import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Contract extends Model {
  static entity = 'contracts'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      player_id: this.attr(null),

      // Database fields
      signed_date: this.attr(null),
      wage: this.attr(null),
      signing_bonus: this.attr(null),
      release_clause: this.attr(null),
      performance_bonus: this.attr(null),
      bonus_req: this.attr(null),
      bonus_req_type: this.attr(null),
      end_date: this.attr(null),
      effective_date: this.attr(null),

      // Associations
      player: this.belongsTo(Player, 'player_id')
    }
  }
}
