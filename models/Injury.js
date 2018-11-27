import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Injury extends Model {
  static entity = 'injuries'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      player_id: this.number(0),

      // Database fields
      start_date: this.string(''),
      end_date: this.string(''),
      description: this.string(''),
      recovered: this.boolean(false)

      // Associations
      player: this.belongsTo(Player, 'player_id')
    }
  }
}
