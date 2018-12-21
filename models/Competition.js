import { Model } from '@vuex-orm/core'
import Stage from './Stage'

export default class Competition extends Model {
  static entity = 'competitions'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      team_id: this.number(0),

      // Database fields
      season: this.number(0),
      name: this.string(''),
      champion: this.string(null).nullable(),
      preset_format: this.attr(null),
      num_teams: this.number(null).nullable(),
      num_teams_per_group: this.number(null).nullable(),
      num_advances_from_group: this.number(null).nullable(),
      num_matches_per_fixture: this.number(null).nullable(),

      // Associations
      stages: this.hasMany(Stage, 'competition_id')
    }
  }
}
