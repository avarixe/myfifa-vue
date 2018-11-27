import { Model } from '@vuex-orm/core'
import Team from './Team'
import PlayerHistory from './PlayerHistory'
import Injury from './Injury'
import Loan from './Loan'
import Contract from './Contract'
import Transfer from './Transfer'
import Cap from './Cap'
import Match from './Match'
import Goal from './Goal'
import Assist from './Assist'
import Booking from './Booking'

export default class Player extends Model {
  static entity = 'players'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      team_id: this.attr(null),

      // Database fields
      name: this.attr(''),
      pos: this.attr(null),
      sec_pos: this.attr([]),
      ovr: this.attr(60),
      value: this.attr(null),
      birth_year: this.attr(null),
      status: this.attr(null),
      youth: this.attr(false),
      kit_no: this.attr(null),

      // Calculated fields
      age: this.attr(null),
      pos_idx: this.attr(null),

      // Associations
      team: this.belongsTo(Team, 'team_id'),
      histories: this.hasMany(PlayerHistory, 'player_id'),
      injuries: this.hasMany(Injury, 'player_id'),
      loans: this.hasMany(Loan, 'player_id'),
      contracts: this.hasMany(Contract, 'player_id'),
      transfers: this.hasMany(Transfer, 'player_id'),
      caps: this.hasMany(Cap, 'player_id'),
      matches: this.hasManyThrough(Match, Cap, 'player_id', 'match_id'),
      goals: this.hasMany(Goal, 'player_id'),
      assists: this.hasMany(Goal, 'assist_id'),
      bookings: this.hasMany(Booking, 'player_id')
    }
  }
}
