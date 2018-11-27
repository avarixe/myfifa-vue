import { Model } from '@vuex-orm/core'
import Team from './Team'

export default class Competition extends Model {
  static entity = 'competitions'

  static fields () {
    return {
      id: this.attr(null),
      team_id: this.attr(null),
      
      season: this.attr(null),
      name: this.attr(''),
      champion: this.attr(null),

      team: this.belongsTo(Team, 'team_id')
    }
  }
}
