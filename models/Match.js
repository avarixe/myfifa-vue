import { Model } from '@vuex-orm/core'
import Team from './Team'

export default class Match extends Model {
  static entity = 'matches'

  static fields () {
    return {
      id: this.attr(null),
      team_id: this.attr(null),
      home: this.attr(''),
      away: this.attr(''),
      competition: this.attr(null),
      date_played: this.attr(null),
      extra_time: this.attr(false),
      home_score: this.attr(null),
      away_score: this.attr(null),

      score: this.attr(null),
      team_result: this.attr(null),

      team: this.belongsTo(Team, 'team_id')
    }
  }
}
