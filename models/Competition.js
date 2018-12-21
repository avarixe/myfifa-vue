import { Model } from '@vuex-orm/core'
import Stage from './Stage'

class Competition extends Model {
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

export function teamOptions (competition) {
  const stages = Object.values(competition.stages)
  let array = stages.reduce((arr, stage) => {
    const tableRows = Object.values(stage.table_rows)
    const fixtures = Object.values(stage.fixtures)
    return [
      ...arr,
      ...tableRows.map(row => row.name),
      ...fixtures.reduce((names, fixture) => {
        return [ ...names, fixture.home_team, fixture.away_team ]
      }, [])
    ]
  }, [])
  return [ ...new Set(array.filter(team => team != null)) ]
}

export default Competition
