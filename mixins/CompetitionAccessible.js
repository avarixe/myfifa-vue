import Component, { mixins } from 'vue-class-component'
import TeamAccessible from './TeamAccessible'
import { Competition } from '@/models'

@Component
export default class CompetitionAccessible extends mixins(TeamAccessible) {
  get competition () {
    return Competition
      .query()
      .with('stages.table_rows|fixtures')
      .find(this.$route.params.competitionId)
  }

  get competitionTeams () {
    return this.competition.teamOptions
  }

  teamClass (name) {
    switch (name) {
      case this.team.title:
        return 'primary--text'
      case this.competition.champion:
        return name ? 'red--text' : ''
      default:
        return ''
    }
  }
}
