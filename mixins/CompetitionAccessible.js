import TeamAccessible from '@/mixins/TeamAccessible'
import { teamOptions } from '@/api/modules/Competition'
import { Competition } from '@/models'

export default {
  mixins: [ TeamAccessible ],
  computed: {
    competition () {
      return Competition.find(this.$route.params.competitionId)
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
