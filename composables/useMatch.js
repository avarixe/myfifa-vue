import { computed, useRoute, useStore } from '@nuxtjs/composition-api'

export default () => {
  const route = useRoute()
  const matchId = computed(() => route.value.params.matchId)

  const store = useStore()
  const match = computed(() => store.$db().model('Match').find(matchId.value))

  return {
    matchId,
    match
  }
}
