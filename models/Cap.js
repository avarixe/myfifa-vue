import { Model } from '@vuex-orm/core'
import Match from './Match'

export default class Cap extends Model {
  static get entity () {
    return 'caps'
  }

  static get title () {
    return 'Cap'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      match_id: this.number(0),
      player_id: this.number(0),

      // Database fields
      pos: this.string(''),
      start: this.number(0),
      stop: this.number(90),
      subbed_out: this.boolean(false),

      // Calculated fields
      name: this.string(''),

      // Associations
      match: this.belongsTo(Match, 'match_id')
    }
  }
}
