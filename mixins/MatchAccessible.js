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
      return Array.from({ length: 120 }, (v, k) => k + 1)
    }
  }
}
