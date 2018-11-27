import { Model } from '@vuex-orm/core'
import Stage from './Stage'

export default class TableRow extends Model {
  static entity = 'tableRows'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      stage_id: this.attr(null),

      // Database fields
      name: this.attr(''),
      wins: this.attr(null),
      draws: this.attr(null),
      losses: this.attr(null),
      goals_for: this.attr(null),
      goals_against: this.attr(null),

      // Calculated fields
      goal_difference: this.attr(null),
      points: this.attr(null),

      // Associations
      stage: this.belongsTo(Stage, 'stage_id')
    }
  }
}
