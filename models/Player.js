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

  static get title () {
    return 'Player'
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

  get link () {
    return {
      name: 'teams-teamId-players-playerId',
      params: {
        teamId: this.team_id,
        playerId: this.id
      }
    }
  }

  get isActive () {
    return this.status && this.status.length > 0
  }

  get statusColor () {
    switch (this.status) {
      case 'Active':
        return 'light-green'
      case 'Loaned':
        return 'indigo'
      case 'Injured':
        return 'pink'
      case 'Pending':
        return 'deep-orange'
      default:
        return 'black'
    }
  }

  get statusIcon () {
    switch (this.status) {
      case 'Active':
        return 'account-check'
      case 'Loaned':
        return 'transit-transfer'
      case 'Injured':
        return 'hospital'
      case 'Pending':
        return 'lock-clock'
      default:
        return 'minus'
    }
  }

  contract () {
    const contract = Contract
      .query()
      .where('player_id', this.id)
      .where('started_on', date => date <= this.team.currently_on)
      .where('ended_on', date => this.team.currently_on < date)
      .last()
    return contract || {}
  }

  injury () {
    const lastInjury = Injury
      .query()
      .where('player_id', this.id)
      .orderBy('started_on', 'asc')
      .last()
    return this.status === 'Injured' && lastInjury && lastInjury.description
  }

  loanedTo () {
    const lastLoan = Loan
      .query()
      .where('player_id', this.id)
      .orderBy('started_on', 'asc')
      .last()
    return this.status === 'Loaned' && lastLoan && lastLoan.destination
  }

  expiresOn () {
    return this.contract.ended_on
  }

  recordAt (date) {
    return PlayerHistory
      .query()
      .where('player_id', this.id)
      .where('recorded_on', recordedOn => recordedOn <= date)
      .last()
  }

  ovrAt (date) {
    return this.recordAt(date).ovr
  }

  valueAt (date) {
    return this.recordAt(date).value
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

export const positions = [
  'GK',
  'RB',
  'RWB',
  'CB',
  'LB',
  'LWB',
  'RM',
  'CDM',
  'CM',
  'CAM',
  'LM',
  'RW',
  'CF',
  'ST',
  'LW'
]
