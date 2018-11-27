import { Model } from '@vuex-orm/core'
import Team from './Team'

export default class Squad extends Model {
  static entity = 'matches'

  static fields () {
    return {
      id: this.attr(null),
      team_id: this.attr(null),
      name: this.attr(''),
      players_list: this.attr([]),
      positions_list: this.attr([]),

      team: this.belongsTo(Team, 'team_id')
    }
  }
}
