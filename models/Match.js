import { Model } from '@vuex-orm/core'
import PenaltyShootout from './PenaltyShootout'
import Goal from './Goal'
import Substitution from './Substitution'
import Booking from './Booking'
import Cap from './Cap'
import Player from './Player'

class Match extends Model {
  static get entity () {
    return 'matches'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      team_id: this.number(0),

      // Database fields
      home: this.string(''),
      away: this.string(''),
      competition: this.string(''),
      date_played: this.string(''),
      extra_time: this.boolean(false),
      home_score: this.number(0),
      away_score: this.number(0),

      // Calculated fields
      score: this.string(''),
      team_result: this.attr(null),

      // Associations
      penalty_shootout: this.hasOne(PenaltyShootout, 'match_id'),
      goals: this.hasMany(Goal, 'match_id'),
      substitutions: this.hasMany(Substitution, 'match_id'),
      bookings: this.hasMany(Booking, 'match_id'),
      caps: this.hasMany(Cap, 'match_id'),
      players: this.hasManyThrough(Player, Cap, 'match_id', 'player_id')
    }
  }
}

function allByRecency (teamId) {
  return Match
    .query()
    .where('team_id', teamId)
    .orderBy('date_played', 'desc')
    .get()
}

export function competitions (teamId) {
  return [
    ...new Set(allByRecency(teamId).map(match => match.competition))
  ]
}

export function teams (teamId) {
  const matches = allByRecency(teamId)
  return [
    ...new Set([
      ...matches.map(match => match.home),
      ...matches.map(match => match.away)
    ])
  ]
}

export default Match
