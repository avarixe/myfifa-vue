import { Model } from '@vuex-orm/core'

export default class Loan extends Model {
  static entity = 'Loan'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(null),
      player_id: this.number(null),

      // Database fields
      started_on: this.string(''),
      signed_on: this.string(''),
      ended_on: this.string('').nullable(),
      origin: this.string(''),
      destination: this.string(''),
      wage_percentage: this.number(0).nullable(),
      returned: this.boolean(false)
    }
  }

  get date () {
    return this.started_on
  }

  get type () {
    return 'loan'
  }
}
