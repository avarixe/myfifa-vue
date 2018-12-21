import { addYears } from 'date-fns'
import { Team } from '@/models'

export default {
  computed: {
    team () {
      return Team.find(this.$route.params.teamId)
    },
    season () {
      const date = this.$_parse(this.team.start_date)
      const currentDate = this.$_parse(this.team.current_date)
      return parseInt((currentDate - date) / (525600 * 60 * 1000))
    },
    seasonStart () {
      let date = this.$_parse(this.team.start_date)
      date = addYears(date, this.season)
      return this.$_format(date, 'YYYY-MM-DD')
    },
    seasonEnd () {
      let date = this.$_parse(this.seasonStart)
      date = addYears(date, 1)
      return this.$_format(date, 'YYYY-MM-DD')
    }
  },
  methods: {
    seasonLabel (season) {
      let start = addYears(this.team.start_date, season)
      const end = addYears(start, 1)
      return `${this.$_format(start, 'YYYY')} - ${this.$_format(end, 'YYYY')}`
    }
  }
}
