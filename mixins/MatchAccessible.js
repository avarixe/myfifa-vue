import { mapGetters } from 'vuex'

export default {
  props: {
    match: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('match', [
      'positions'
    ]),
    minutes () {
      return Array.from({ length: 120 }, (v, k) => k + 1)
    }
  }
}
