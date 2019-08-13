import { Vue, Component } from 'nuxt-property-decorator'
import { format, parse, addYears, differenceInYears } from 'date-fns'
import { Team } from '@/models'

@Component
export default class TeamAccessible extends Vue {
  get team () {
    return Team.find(this.$route.params.teamId)
  }

  get season () {
    const date = this.$_parse(this.team.started_on)
    const currentDate = this.$_parse(this.team.currently_on)
    return differenceInYears(currentDate, date)
  }

  get seasonStart () {
    const date = parse(this.team.started_on)
    return format(addYears(date, this.season), 'YYYY-MM-DD')
  }

  get seasonEnd () {
    const date = parse(this.seasonStart)
    return format(addYears(date, 1), 'YYYY-MM-DD')
  }

  seasonLabel (season) {
    let start = addYears(this.team.started_on, season)
    const end = addYears(start, 1)
    return `${this.$_format(start, 'YYYY')} - ${this.$_format(end, 'YYYY')}`
  }

  linkTo (page) {
    return {
      name: `teams-teamId-${page}`,
      params: { teamId: this.team.id }
    }
  }
}
