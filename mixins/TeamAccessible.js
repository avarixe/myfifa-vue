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

  seasonLabel (season) {
    let start = addYears(this.team.start_date, season)
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
