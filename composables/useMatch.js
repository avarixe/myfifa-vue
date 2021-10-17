import { ref, computed, useRoute, useStore } from '@nuxtjs/composition-api'
import orderBy from 'lodash.orderby'
import useTeam from './useTeam'
import { matchPositions } from '@/constants'

export default () => {
  const route = useRoute()
  const matchId = computed(() => route.value.params.matchId)

  const store = useStore()
  const match = computed(() =>
    store.$db().model('Match')
      .query()
      .with('team|goals|bookings|substitutions|penaltyShootout')
      .with('caps.player')
      .find(matchId.value)
  )

  const positions = Object.keys(matchPositions)
  const sortedCaps = computed(() => {
    return orderBy(
      match.value.caps,
      cap => positions.indexOf(cap.pos),
      'start'
    )
  })

  const minute = ref(null)
  const unsubbedPlayers = computed(() => {
    return sortedCaps.value.filter(cap => {
      return minute.value
        ? cap.start <= minute.value && minute.value <= cap.stop
        : !cap.subbedOut
    })
  })

  const { team } = useTeam()
  const isTeamHome = computed(() => match.value.home === team.value.name)

  return {
    matchId,
    match,
    minute,
    positions,
    sortedCaps,
    unsubbedPlayers,
    isTeamHome
  }
}
