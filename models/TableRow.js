import { Model } from '@vuex-orm/core'

export default class TableRow extends Model {
  static get entity () {
    return 'tableRows'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      stage_id: this.number(0),

      // Database fields
      name: this.string('').nullable(),
      wins: this.number(null).nullable(),
      draws: this.number(null).nullable(),
      losses: this.number(null).nullable(),
      goals_for: this.number(null).nullable(),
      goals_against: this.number(null).nullable(),

      // Calculated fields
      goal_difference: this.number(null).nullable(),
      points: this.number(null).nullable()
    }
  }
}
