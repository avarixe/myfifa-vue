import { Model } from '@vuex-orm/core'
import Competition from './Competition'
import Fixture from './Fixture'
import TableRow from './TableRow'

export default class Stage extends Model {
  static entity = 'fixtures'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      competition_id: this.number(0),

      // Database fields
      name: this.string(''),
      num_teams: this.number(0),
      num_fixtures: this.number(0),
      table: this.boolean(false),

      // Associations
      competition: this.belongsTo(Competition, 'competition_id'),
      fixtures: this.hasMany(Fixture, 'stage_id'),
      tableRows: this.hasMany(TableRow, 'stage_id')
    }
  }
}
