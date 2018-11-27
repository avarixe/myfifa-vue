import { Model } from '@vuex-orm/core'
import Team from './Team'
import Stage from './Stage'

export default class Competition extends Model {
  static entity = 'competitions'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      team_id: this.attr(null),

      // Database fields
      season: this.attr(null),
      name: this.attr(''),
      champion: this.attr(null),
      preset_format: this.attr(null),
      num_teams: this.attr(null),
      num_teams_per_group: this.attr(null),
      num_advances_from_group: this.attr(null),
      num_matches_per_fixture: this.attr(null),

      // Associations
      team: this.belongsTo(Team, 'team_id'),
      stages: this.hasMany(Stage, 'competition_id')
    }
  }
}
