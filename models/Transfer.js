import { Model } from '@vuex-orm/core'

export default class Transfer extends Model {
  static entity = 'transfers'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      player_id: this.number(0),

      // Database fields
      signed_date: this.string(''),
      effective_date: this.string(''),
      origin: this.string(''),
      destination: this.string(''),
      fee: this.number(null).nullable(),
      traded_player: this.string(null).nullable(),
      addon_clause: this.number(null).nullable(),
      loan: this.boolean(false)
    }
  }
}
