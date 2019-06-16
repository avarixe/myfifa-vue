import { Model } from '@vuex-orm/core'

export default class Squad extends Model {
  static get entity () {
    return 'squads'
  }

  static get title () {
    return 'Squad'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      team_id: this.number(0),

      // Database fields
      name: this.string(''),
      players_list: this.attr([]),
      positions_list: this.attr([])
    }
  }
}
