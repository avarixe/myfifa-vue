import { Model } from '@vuex-orm/core'
import orderBy from 'lodash.orderby'
import PlayerHistory from './PlayerHistory'
import Injury from './Injury'
import Loan from './Loan'
import Contract from './Contract'
import Transfer from './Transfer'
import Cap from './Cap'
import Match from './Match'
import Goal from './Goal'
import Booking from './Booking'
import Team from './Team'

class Player extends Model {
  static get entity () {
    return 'players'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      team_id: this.number(0),

      // Database fields
      name: this.string(''),
      pos: this.string(''),
      sec_pos: this.attr([]),
      ovr: this.number(60),
      value: this.number(null).nullable(),
      birth_year: this.number(null).nullable(),
      status: this.string(null).nullable(),
      youth: this.boolean(false),
      kit_no: this.number(null).nullable(),

      // Calculated fields
      age: this.number(16),
      pos_idx: this.number(0),

      // Associations
      team: this.belongsTo(Team, 'team_id'),
      histories: this.hasMany(PlayerHistory, 'player_id'),
      injuries: this.hasMany(Injury, 'player_id'),
      loans: this.hasMany(Loan, 'player_id'),
      contracts: this.hasMany(Contract, 'player_id'),
      transfers: this.hasMany(Transfer, 'player_id'),
      caps: this.hasMany(Cap, 'player_id'),
      matches: this.belongsToMany(Match, Cap, 'player_id', 'match_id'),
      goals: this.hasMany(Goal, 'player_id'),
      assists: this.hasMany(Goal, 'assist_id'),
      bookings: this.hasMany(Booking, 'player_id')
    }
  }

  get contract () {
    const contract = this.contracts.slice(-1)[0]

    return contract &&
           contract.effective_date <= this.team.current_date &&
           this.team.current_date < contract.end_date
      ? contract
      : {}
  }

  get cleanSheets () {
    return this.matches.filter(m =>
      (m.home === this.team.title && m.away_score === 0) ||
      (m.away === this.team.title && m.home_score === 0)
    )
  }
}

export function contractedPlayers (teamId) {
  return orderBy(
    Player
      .query()
      .where('team_id', teamId)
      .where('status', status => status)
      .get(),
    ['pos_idx', 'ovr'],
    ['asc', 'desc']
  )
}

export function activePlayers (teamId) {
  return contractedPlayers(teamId)
    .filter(player => player.status === 'Active')
}

export default Player
