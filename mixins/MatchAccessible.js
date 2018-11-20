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
    sortedCaps () {
      return this.$_orderBy(
        Object.values(this.match.caps),
        [ c => this.positions.indexOf(c.pos), 'start' ]
      )
    },
    minutes () {
      return Array.from({ length: this.match.extra_time ? 120 : 90 }, (v, k) => k + 1)
    }
  }
}
