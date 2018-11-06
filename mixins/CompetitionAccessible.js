import { mapState } from 'vuex'
import TeamAccessible from '@/mixins/TeamAccessible'
import { teamOptions } from '@/api/modules/competition'

export default {
  mixins: [ TeamAccessible ],
  computed: {
    ...mapState('competition', { competitions: 'list' }),
    competition () {
      return this.competitions[this.$route.params.competitionId]
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
