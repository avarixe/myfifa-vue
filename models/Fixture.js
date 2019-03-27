import { Model } from '@vuex-orm/core'

export default class Fixture extends Model {
  static get entity () {
    return 'fixtures'
  }
  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      stage_id: this.number(0),

      // Database fields
      home_team: this.string('').nullable(),
      away_team: this.string('').nullable(),
      home_score: this.string('').nullable(),
      away_score: this.string('').nullable()
    }
  }
}
