import { Model } from '@vuex-orm/core'
import { positions } from './Match'

export default class SquadPlayer extends Model {
  static get entity () {
    return 'squadPlayers'
  }

  static get title () {
    return 'Squad Player'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      squad_id: this.number(0),
      player_id: this.number(0),

      // Database fields
      pos: this.string('')
    }
  }

  get positionType () {
    return positions[this.pos]
  }
}
