import { Model } from '@vuex-orm/core'

export default class PlayerHistory extends Model {
  static entity = 'PlayerHistory'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      player_id: this.number(0),

      // Database fields
      recorded_on: this.string(''),
      ovr: this.number(60),
      value: this.number(0),
      kit_no: this.number(0).nullable()
    }
  }
}
