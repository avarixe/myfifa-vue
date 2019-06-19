import { Model } from '@vuex-orm/core'
import Player from './Player'
import Match from './Match'
import Squad from './Squad'
import Competition from './Competition'

export default class Team extends Model {
  static get entity () {
    return 'teams'
  }

  static get title () {
    return 'Team'
  }

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),

      // Database fields
      title: this.string(''),
      start_date: this.string(''),
      current_date: this.string(''),
      active: this.boolean(true),
      currency: this.string('$'),

      // Calculated fields
      time_period: this.string(''),

      // Associations
      players: this.hasMany(Player, 'team_id'),
      matches: this.hasMany(Match, 'team_id'),
      squads: this.hasMany(Squad, 'team_id'),
      competitions: this.hasMany(Competition, 'team_id')
    }
  }

  get link () {
    return {
      name: 'teams-teamId',
      params: { teamId: this.id }
    }
  }

  linkTo (page) {
    return {
      name: `teams-teamId-${page}`,
      params: { teamId: this.id }
    }
  }

  linkToSeason (season) {
    return {
      name: 'teams-teamId-seasons-season',
      params: {
        teamId: this.id,
        season
      }
    }
  }
}
