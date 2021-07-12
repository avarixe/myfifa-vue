import { Model } from '@vuex-orm/core'
import Match from './Match'
import Stage from './Stage'
import Team from './Team'
import { parseISO, format, addYears } from 'date-fns'

class Competition extends Model {
  static entity = 'Competition'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      teamId: this.number(0),

      // Database fields
      season: this.number(0),
      name: this.string(''),
      champion: this.string(null).nullable(),
      preset_format: this.attr(null),
      num_teams: this.number(null).nullable(),
      num_teams_per_group: this.number(null).nullable(),
      num_advances_from_group: this.number(null).nullable(),

      // Associations
      team: this.belongsTo(Team, 'teamId'),
      stages: this.hasMany(Stage, 'competition_id')
    }
  }

  get link () {
    return {
      name: 'teams-teamId-competitions-competitionId',
      params: {
        teamId: this.teamId,
        competitionId: this.id
      }
    }
  }

  get linkToSeason () {
    return {
      name: 'teams-teamId-seasons-season',
      params: {
        teamId: this.teamId,
        season: this.season
      }
    }
  }

  get statusIcon () {
    if (this.champion === this.team.name) {
      return 'mdi-trophy'
    } else if (this.champion) {
      return 'mdi-check'
    } else {
      return 'mdi-timelapse'
    }
  }

  get statusColor () {
    if (this.champion === this.team.name) {
      return 'yellow darken-2'
    } else if (this.champion) {
      return 'green'
    } else {
      return 'gray'
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
    return [ ...new Set(array.filter(team => team !== null && team !== '')) ].sort()
  }

  get seasonStart () {
    const date = parseISO(this.team.startedOn)
    return format(addYears(date, this.season), 'yyyy-MM-dd')
  }

  get seasonEnd () {
    const date = parseISO(this.seasonStart)
    return format(addYears(date, 1), 'yyyy-MM-dd')
  }

  get matches () {
    const start = this.seasonStart
    const end = this.seasonEnd
    return Match
      .query()
      .where('competition', this.name)
      .where('teamId', this.teamId)
      .where('playedOn', date => start <= date && date <= end)
      .get()
  }
}

export default Competition
