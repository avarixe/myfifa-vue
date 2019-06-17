import { Vue, Component } from 'nuxt-property-decorator'
import { addYears } from 'date-fns'
import { Team } from '@/models'

@Component
export default class TeamAccessible extends Vue {
  get team () {
    return Team.find(this.$route.params.teamId)
  }

  get season () {
    const date = this.$_parse(this.team.start_date)
    const currentDate = this.$_parse(this.team.current_date)
    return parseInt((currentDate - date) / (525600 * 60 * 1000))
  }

  get seasonStart () {
    let date = this.$_parse(this.team.start_date)
    date = addYears(date, this.season)
    return this.$_format(date, 'YYYY-MM-DD')
  }

  get seasonEnd () {
    let date = this.$_parse(this.seasonStart)
    date = addYears(date, 1)
    return this.$_format(date, 'YYYY-MM-DD')
  }

  seasonLabel (season) {
    let start = addYears(this.team.start_date, season)
    const end = addYears(start, 1)
    return `${this.$_format(start, 'YYYY')} - ${this.$_format(end, 'YYYY')}`
  }
}
