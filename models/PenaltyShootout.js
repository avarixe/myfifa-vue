import { Model } from '@vuex-orm/core'

export default class PenaltyShootout extends Model {
  static get entity () {
    return 'penaltyShootouts'
  }

  static get title () {
    return 'Penalty Shootout'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      match_id: this.number(0),

      // Database fields
      home_score: this.number(0),
      away_score: this.number(0)
    }
  }
}
