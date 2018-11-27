import { Model } from '@vuex-orm/core'
import Team from './Team'

export default class Player extends Model {
  static entity = 'players'

  static fields () {
    return {
      id: this.attr(null),
      team_id: this.attr(null),
      name: this.attr(''),
      pos: this.attr(null),
      sec_pos: this.attr([]),
      ovr: this.attr(60),
      value: this.attr(null),
      birth_year: this.attr(null),
      status: this.attr(null),
      youth: this.attr(false),
      kit_no: this.attr(null),

      team: this.belongsTo(Team, 'team_id')
    }
  }
}
