import { Model } from '@vuex-orm/core'

export default class Loan extends Model {
  static get entity () {
    return 'loans'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(null),
      player_id: this.number(null),

      // Database fields
      start_date: this.string(''),
      end_date: this.string('').nullable(),
      destination: this.string(''),
      returned: this.boolean(false)
    }
  }
}
