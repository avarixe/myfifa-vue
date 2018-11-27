import { Model } from '@vuex-orm/core'
import Team from './Team'
import PenaltyShootout from './PenaltyShootout'
import Goal from './Goal'
import Substitution from './Substitution'
import Booking from './Booking'
import Cap from './Cap'
import Player from './Player'

export default class Match extends Model {
  static entity = 'matches'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      team_id: this.attr(null),

      // Database fields
      home: this.attr(''),
      away: this.attr(''),
      competition: this.attr(null),
      date_played: this.attr(null),
      extra_time: this.attr(false),
      home_score: this.attr(null),
      away_score: this.attr(null),

      // Calculated fields
      score: this.attr(''),
      team_result: this.attr(null),

      // Associations
      team: this.belongsTo(Team, 'team_id'),
      penaltyShootout: this.hasOne(PenaltyShootout, 'match_id'),
      goals: this.hasMany(Goal, 'match_id'),
      substitutions: this.hasMany(Substitution, 'match_id'),
      bookings: this.hasMany(Booking, 'match_id'),
      caps: this.hasMany(Cap, 'match_id'),
      players: this.hasManyThrough(Player, Cap, 'match_id', 'player_id')
    }
  }
}
