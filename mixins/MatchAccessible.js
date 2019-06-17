import { Vue, Component } from 'vue-property-decorator'
import { positions } from '@/models/Match'

@Component({
  props: {
    match: {
      type: Object,
      required: true
    }
  }
})
export default class MatchAccessible extends Vue {
  minute = 0

  get positions () {
    return Object.keys(positions)
  }

  get sortedCaps () {
    return this.$_orderBy(
      this.match.caps,
      [ c => this.positions.indexOf(c.pos), 'start' ]
    )
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
