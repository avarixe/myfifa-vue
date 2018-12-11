import { mapGetters } from 'vuex'
import { addYears } from 'date-fns'

export default {
  computed: mapGetters({
    team: 'entities/teams/current'
  }),
  methods: {
    seasonLabel (season) {
      let start = addYears(this.team.start_date, season)
      const end = addYears(start, 1)
      return `${this.$_format(start, 'YYYY')} - ${this.$_format(end, 'YYYY')}`
    }
  }
}
