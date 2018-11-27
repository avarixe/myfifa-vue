import { Model } from '@vuex-orm/core'
import Stage from './Stage'

export default class Fixture extends Model {
  static entity = 'fixtures'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      stage_id: this.attr(null),

      // Database fields
      home_team: this.attr(null),
      away_team: this.attr(null),
      home_score: this.attr(null),
      away_score: this.attr(null),

      // Associations
      stage: this.belongsTo(Stage, 'stage_id')
    }
  }
}
