import { mapState } from 'vuex'
import TeamAccessible from '@/mixins/TeamAccessible'

export default {
  mixins: [ TeamAccessible ],
  computed: {
    ...mapState('competition', { competitions: 'list' }),
    competition () {
      return this.competitions[this.$route.params.id]
    }
  },
  methods: {
    teamClass (name) {
      switch (name) {
        case this.team.title:
          return 'primary--text'
        case this.competition.champion:
          return 'red--text'
        default:
          return ''
      }
    }
  }
}
