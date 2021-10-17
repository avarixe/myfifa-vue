import { computed, useStore } from '@nuxtjs/composition-api'
import useTeam from './useTeam'
import orderBy from 'lodash.orderby'

export default () => {
  const store = useStore()
  const { teamId } = useTeam()

  return computed(() =>
    orderBy(
      store.$db().model('Player')
        .query()
        .where('teamId', parseInt(teamId.value))
        .where('status', 'Active')
        .get(),
      ['posIdx', 'ovr'],
      ['asc', 'desc']
    )
  )
}
