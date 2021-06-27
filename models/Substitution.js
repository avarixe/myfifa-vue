import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Substitution extends Model {
  static entity = 'Substitution'

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
      created_at: this.string(''),

      // Calculated fields
      home: this.boolean(true),

      // Associations
      replacement: this.belongsTo(Player, 'replacement_id', 'id')
    }
  }

  get type () {
    return 'substitution'
  }
}
