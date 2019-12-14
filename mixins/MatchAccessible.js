import { Vue, Component, Prop } from 'nuxt-property-decorator'
import orderBy from 'lodash.orderby'
import { positions } from '@/models/Match'

@Component
export default class MatchAccessible extends Vue {
  @Prop(Object, { required: true }) match

  minute = 0

  get positions () {
    return Object.keys(positions)
  }

  get sortedCaps () {
    return orderBy(this.match.caps, c => this.positions.indexOf(c.pos), 'start')
  }

  get unsubbedPlayers () {
    if (this.minute) {
      return this.sortedCaps.filter(c => {
        return c.start <= this.minute && this.minute <= c.stop
      })
    } else {
      return this.sortedCaps.filter(c => !c.subbed_out)
    }
  }
}
