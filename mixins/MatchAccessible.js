import { mapState } from 'vuex'

export default {
  props: {
    match: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    minute: 0
  }),
  computed: {
    ...mapState('entities/matches', [
      'positions'
    ]),
    sortedCaps () {
      return this.$_orderBy(
        this.match.caps,
        [ c => this.positions.indexOf(c.pos), 'start' ]
      )
    },
    unsubbedPlayers () {
      if (this.minute) {
        return this.sortedCaps.filter(c => {
          return c.start <= this.minute && this.minute <= c.stop
        })
      } else {
        return this.sortedCaps.filter(c => !c.subbed_out)
      }
    },
    minutes () {
      return Array.from(
        { length: this.match.extra_time ? 120 : 90 },
        (v, k) => k + 1
      )
    }
  }
}
