import { ref, computed, useRoute, useStore } from '@nuxtjs/composition-api'
import orderBy from 'lodash.orderby'
import { matchPositions } from '@/constants'

export default () => {
  const route = useRoute()
  const matchId = computed(() => route.value.params.matchId)

  const store = useStore()
  const match = computed(() => store.$db().model('Match').find(matchId.value))

  const positions = computed(() => Object.keys(matchPositions))
  const sortedCaps = computed(() => {
    return orderBy(
      match.value.caps,
      cap => positions.value.indexOf(cap.pos),
      'start'
    )
  })

  const minute = ref(null)
  const unsubbedPlayers = computed(() => {
    return sortedCaps.value.filter(cap => {
      return minute.value
        ? cap.start <= this.minute && this.minute <= cap.stop
        : !cap.subbedOut
    })
  })

  return {
    matchId,
    match,
    minute,
    positions,
    sortedCaps,
    unsubbedPlayers
  }
}
