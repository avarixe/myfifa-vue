import orderBy from 'lodash.orderby'
import { positions } from '@/models/Match'

export default {
  props: {
    match: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    minute: null
  }),
  computed: {
    positions () {
      return Object.keys(positions)
    },
    sortedCaps () {
      return orderBy(this.match.caps, c => this.positions.indexOf(c.pos), 'start')
    },
    unsubbedPlayers () {
      if (this.minute) {
        return this.sortedCaps.filter(c => {
          return c.start <= this.minute && this.minute <= c.stop
        })
      } else {
        return this.sortedCaps.filter(c => !c.subbed_out)
      }
    }
  }
}
