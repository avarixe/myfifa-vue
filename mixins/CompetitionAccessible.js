import TeamAccessible from './TeamAccessible'
import { Competition } from '@/models'

export default {
  mixins: [
    TeamAccessible
  ],
  computed: {
    competition () {
      return Competition
        .query()
        .with('stages.table_rows|fixtures')
        .find(this.$route.params.competitionId)
    },
    competitionTeams () {
      return this.competition.teamOptions
    }
  },
  methods: {
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
}
