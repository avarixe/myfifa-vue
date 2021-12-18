import { Model } from '@vuex-orm/core'
import Player from './Player'
import Match from './Match'
import Squad from './Squad'
import Competition from './Competition'

export default class Team extends Model {
  static entity =  'Team'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),

      // Database fields
      name: this.string(''),
      startedOn: this.string(''),
      currentlyOn: this.string(''),
      active: this.boolean(true),
      currency: this.string('$'),

      // Calculated fields
      timePeriod: this.string(''),
      badgePath: this.string('').nullable(),

      // Associations
      players: this.hasMany(Player, 'teamId'),
      matches: this.hasMany(Match, 'teamId'),
      squads: this.hasMany(Squad, 'teamId'),
      competitions: this.hasMany(Competition, 'teamId')
    }
  }
}
