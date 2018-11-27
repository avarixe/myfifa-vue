import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class PlayerHistory extends Model {
  static entity = 'playerHistories'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      player_id: this.attr(null),

      // Database fields
      datestamp: this.attr(null),
      ovr: this.attr(null),
      value: this.attr(null),
      kit_no: this.attr(null)

      // Associations
      player: this.belongsTo(Player, 'player_id')
    }
  }
}
