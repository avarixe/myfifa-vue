import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Contract extends Model {
  static entity = 'Contract'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      player_id: this.number(0),

      // Database fields
      signed_on: this.string(''),
      wage: this.number(null).nullable(),
      signing_bonus: this.number(null).nullable(),
      release_clause: this.number(null).nullable(),
      performance_bonus: this.number(null).nullable(),
      bonus_req: this.number(null).nullable(),
      bonus_req_type: this.string(null).nullable(),
      ended_on: this.string(''),
      started_on: this.string(''),
      conclusion: this.string(null).nullable(),

      // Associations
      player: this.belongsTo(Player, 'player_id', 'id')
    }
  }

  get date () {
    return this.started_on
  }

  get type () {
    return 'contract'
  }
}
