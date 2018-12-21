import { mapState } from 'vuex'

export default {
  props: {
    match: {
      type: Object,
      required: true
    }
  },
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
    minutes () {
      return Array.from({ length: this.match.extra_time ? 120 : 90 }, (v, k) => k + 1)
    }
  }
}
