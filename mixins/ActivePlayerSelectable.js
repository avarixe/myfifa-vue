import orderBy from 'lodash.orderby'

export default {
  computed: {
    activePlayers () {
      return orderBy(
        this.$store.$db().model('Player')
          .query()
          .where('teamId', parseInt(this.$route.params.teamId))
          .where('status', status => status)
          .get(),
        ['pos_idx', 'ovr'],
        ['asc', 'desc']
      ).filter(player => player.status === 'Active')
    }
  }
}
