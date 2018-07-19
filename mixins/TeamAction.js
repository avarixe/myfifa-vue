import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('team', {
      team: 'active'
    })
  }
}
