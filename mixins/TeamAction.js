import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    team: 'team/current'
  })
}
