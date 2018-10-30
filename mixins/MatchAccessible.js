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
      return Object.values(this.match.performances).sort((a, b) => {
        let aPos = this.positions.indexOf(a.pos)
        let bPos = this.positions.indexOf(b.pos)
        return aPos - bPos || a.start - b.start
      })
    },
    minutes () {
      return Array.from({ length: 120 }, (v, k) => k + 1)
    }
  }
}
