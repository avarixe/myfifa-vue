import { Model } from '@vuex-orm/core'

export default class Contract extends Model {
  static entity = 'contracts'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      player_id: this.number(0),

      // Database fields
      signed_date: this.string(''),
      wage: this.number(null).nullable(),
      signing_bonus: this.number(null).nullable(),
      release_clause: this.number(null).nullable(),
      performance_bonus: this.number(null).nullable(),
      bonus_req: this.number(null).nullable(),
      bonus_req_type: this.number(null).nullable(),
      end_date: this.string(''),
      effective_date: this.string('')
    }
  }
}
