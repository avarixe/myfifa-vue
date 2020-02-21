import orderBy from 'lodash.orderby'
import { positions } from '@/models/Match'

export default {
  props: {
    match: { type: Object, required: true }
  },
  data: () => ({
    minute: null
  }),
  computed: {
    positions () {
      return Object.keys(positions)
    },
    sortedCaps () {
      return orderBy(
        this.match.caps,
        c => this.positions.indexOf(c.pos),
        'start'
      )
    },
    unsubbedPlayers () {
      return this.sortedCaps.filter(cap => {
        return this.minute
          ? cap.start <= this.minute && this.minute <= cap.stop
          : !cap.subbed_out
      })
    }
  }
}
