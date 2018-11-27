import { Model } from '@vuex-orm/core'
import Team from './Team'

export default class Squad extends Model {
  static entity = 'matches'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      team_id: this.number(0),

      // Database fields
      name: this.string(''),
      players_list: this.attr([]),
      positions_list: this.attr([]),

      // Associations
      team: this.belongsTo(Team, 'team_id')
    }
  }
}
