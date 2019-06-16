import { Model } from '@vuex-orm/core'

export default class PlayerHistory extends Model {
  static get entity () {
    return 'playerHistories'
  }

  static get title () {
    return 'Player History'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      player_id: this.number(0),

      // Database fields
      datestamp: this.string(''),
      ovr: this.number(60),
      value: this.number(0),
      kit_no: this.number(0).nullable()
    }
  }
}
