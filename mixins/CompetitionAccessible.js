import TeamAccessible from '@/mixins/TeamAccessible'
import Competition, { teamOptions } from '@/models/Competition'

export default {
  mixins: [ TeamAccessible ],
  computed: {
    competition () {
      return Competition
        .query()
        .with('stages.table_rows|fixtures')
        .find(this.$route.params.competitionId)
    },
    competitionTeams () {
      return teamOptions(this.competition)
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
