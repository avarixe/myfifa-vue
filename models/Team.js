import { Model } from '@vuex-orm/core'
import Player from './Player'
import Match from './Match'
import Squad from './Squad'
import Competition from './Competition'

export default class Team extends Model {
  static entity = 'teams'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),

      // Database fields
      title: this.attr(''),
      start_date: this.attr(null),
      current_date: this.attr(null),
      active: this.attr(true),
      currency: this.attr('$'),

      // Calculated fields
      time_period: this.attr(null),

      // Associations
      players: this.hasMany(Player, 'team_id'),
      matches: this.hasMany(Match, 'team_id'),
      squads: this.hasMany(Squad, 'team_id'),
      competitions: this.hasMany(Competition, 'team_id')
    }
  }
}
