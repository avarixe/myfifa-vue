import { Model } from '@vuex-orm/core'

export default class FixtureLeg extends Model {
  static get entity () {
    return 'fixtureLegs'
  }

  static get title () {
    return 'Fixture Leg'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      fixture_id: this.number(0),

      // Database fields
      home_score: this.string('').nullable(),
      away_score: this.string('').nullable()
    }
  }

  get score () {
    return `${this.home_score || ''} - ${this.away_score || ''}`
  }
}
