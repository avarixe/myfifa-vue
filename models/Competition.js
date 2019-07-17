import { Model } from '@vuex-orm/core'
import Match from './Match'
import Stage from './Stage'
import Team from './Team'
import { parse, format, addYears } from 'date-fns'

class Competition extends Model {
  static get entity () {
    return 'competitions'
  }

  static get title () {
    return 'Competition'
  }

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
      team: this.belongsTo(Team, 'team_id'),
      stages: this.hasMany(Stage, 'competition_id')
    }
  }

  get link () {
    return {
      name: 'teams-teamId-competitions-competitionId',
      params: {
        teamId: this.team_id,
        competitionId: this.id
      }
    }
  }

  get linkToSeason () {
    return {
      name: 'teams-teamId-seasons-season',
      params: {
        teamId: this.team_id,
        season: this.season
      }
    }
  }

  get teamOptions () {
    let array = this.stages.reduce((arr, stage) => {
      return [
        ...arr,
        ...stage.table_rows.map(row => row.name),
        ...stage.fixtures.reduce((names, fixture) => {
          return [ ...names, fixture.home_team, fixture.away_team ]
        }, [])
      ]
    }, [])
    return [ ...new Set(array.filter(team => team !== null && team !== '')) ]
  }

  get seasonStart () {
    const date = parse(this.team.start_date)
    return format(addYears(date, this.season), 'YYYY-MM-DD')
  }

  get seasonEnd () {
    const date = parse(this.seasonStart)
    return format(addYears(date, 1), 'YYYY-MM-DD')
  }

  get matches () {
    const start = this.seasonStart
    const end = this.seasonEnd
    return Match
      .query()
      .where('competition', this.name)
      .where('team_id', this.team_id)
      .where('date_played', date => start <= date && date <= end)
      .get()
  }
}

export default Competition
