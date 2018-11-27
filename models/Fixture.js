import { Model } from '@vuex-orm/core'
import Stage from './Stage'

export default class Fixture extends Model {
  static entity = 'fixtures'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      stage_id: this.number(0),

      // Database fields
      home_team: this.string(''),
      away_team: this.string(''),
      home_score: this.string(''),
      away_score: this.string(''),

      // Associations
      stage: this.belongsTo(Stage, 'stage_id')
    }
  }
}
