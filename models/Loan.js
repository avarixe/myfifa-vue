import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Loan extends Model {
  static entity = 'loans'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      player_id: this.attr(null),

      // Database fields
      start_date: this.attr(null),
      end_date: this.attr(null),
      destination: this.attr(''),
      returned: this.attr(false)

      // Associations
      player: this.belongsTo(Player, 'player_id')
    }
  }
}
