import { mapState } from 'vuex'

export default {
  props: {
    match: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState('match', [
      'positions'
    ]),
    sortedPerformances () {
      return this.$_orderBy(
        Object.values(this.match.performances),
        [ p => this.positions.indexOf(p.pos), 'start' ]
      )
    },
    minutes () {
      return Array.from({ length: 120 }, (v, k) => k + 1)
    }
  }
}
