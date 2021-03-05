import { Model } from '@vuex-orm/core'
import { parseISO } from 'date-fns'
import Team from './Team'
import PenaltyShootout from './PenaltyShootout'
import Goal from './Goal'
import Substitution from './Substitution'
import Booking from './Booking'
import Cap from './Cap'
import Player from './Player'

class Match extends Model {
  static entity = 'Match'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      team_id: this.number(0),

      // Database fields
      home: this.string(''),
      away: this.string(''),
      competition: this.string(''),
      stage: this.string('').nullable(),
      played_on: this.string(''),
      extra_time: this.boolean(false),
      home_score: this.number(0),
      away_score: this.number(0),

      // Calculated fields
      score: this.string(''),
      team_result: this.attr(null),

      // Associations
      team: this.belongsTo(Team, 'team_id'),
      penalty_shootout: this.hasOne(PenaltyShootout, 'match_id'),
      goals: this.hasMany(Goal, 'match_id'),
      substitutions: this.hasMany(Substitution, 'match_id'),
      bookings: this.hasMany(Booking, 'match_id'),
      caps: this.hasMany(Cap, 'match_id'),
      players: this.belongsToMany(Player, Cap, 'match_id', 'player_id')
    }
  }

  get link () {
    return {
      name: 'teams-teamId-matches-matchId',
      params: {
        teamId: this.team_id,
        matchId: this.id
      }
    }
  }

  get opponent () {
    return this.home === this.team.title
      ? this.away
      : this.home
  }

  get season () {
    const startDate = parseISO(this.team.started_on)
    const datePlayed = parseISO(this.played_on)
    return parseInt((datePlayed - startDate) / (525600 * 60 * 1000))
  }

  get resultColor () {
    switch (this.team_result) {
      case 'win':
        return 'success'
      case 'draw':
        return 'warning'
      case 'loss':
        return 'red'
      default:
        return ''
    }
  }
}

function allByRecency (teamId) {
  return Match
    .query()
    .where('team_id', teamId)
    .orderBy('played_on', 'desc')
    .get()
}

export function competitions (teamId) {
  return [
    ...new Set(allByRecency(teamId).map(match => match.competition))
  ]
}

export const positions = {
  GK: 'DEF',
  LB: 'DEF',
  LWB: 'DEF',
  LCB: 'DEF',
  CB: 'DEF',
  RCB: 'DEF',
  RB: 'DEF',
  RWB: 'DEF',
  LM: 'MID',
  LDM: 'MID',
  LCM: 'MID',
  CDM: 'MID',
  CM: 'MID',
  RDM: 'MID',
  RCM: 'MID',
  RM: 'MID',
  LAM: 'MID',
  CAM: 'MID',
  RAM: 'MID',
  LW: 'ATT',
  CF: 'ATT',
  LS: 'ATT',
  ST: 'ATT',
  RS: 'ATT',
  RW: 'ATT'
}

export default Match
