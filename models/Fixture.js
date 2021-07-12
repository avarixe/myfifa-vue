import { Model } from '@vuex-orm/core'
import FixtureLeg from './FixtureLeg'

export default class Fixture extends Model {
  static entity = 'Fixture'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      stage_id: this.number(0),

      // Database fields
      home_team: this.string('').nullable(),
      away_team: this.string('').nullable(),

      // Associations
      legs: this.hasMany(FixtureLeg, 'fixture_id', 'id')
    }
  }

  get score () {
    return ''
  }
  // get score () {
  //   return `${this.homeScore || ''} - ${this.awayScore || ''}`
  // }
}
