import { Model } from '@vuex-orm/core'
import Competition from './Competition'
import Fixture from './Fixture'
import TableRow from './TableRow'

export default class Fixture extends Model {
  static entity = 'fixtures'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.attr(null),
      competition_id: this.attr(null),

      // Database fields
      name: this.attr(''),
      num_teams: this.attr(null),
      num_fixtures: this.attr(null),
      table: this.attr(false),

      // Associations
      competition: this.belongsTo(Competition, 'competition_id'),
      fixtures: this.hasMany(Fixture, 'stage_id')
      tableRows: this.hasMany(TableRow, 'stage_id'),
    }
  }
}
