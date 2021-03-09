import { Model } from '@vuex-orm/core'
import { matchPositions } from '@/constants'

export default class SquadPlayer extends Model {
  static entity = 'SquadPlayer'

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
    return matchPositions[this.pos]
  }
}
