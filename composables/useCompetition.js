import { computed, useRoute, useStore } from '@nuxtjs/composition-api'
import useTeam from './useTeam'

export default () => {
  const route = useRoute()
  const competitionId = computed(() => route.value.params.competitionId)

  const store = useStore()
  const competition = computed(() =>
    store.$db().model('Competition')
      .query()
      .with('stages.tableRows|fixtures')
      .find(competitionId.value)
  )

  const { team } = useTeam()
  const teamClass = name => {
    switch (name) {
      case team.value.name:
        return 'primary--text'
      case competition.value.champion:
        return name ? 'red--text' : ''
      default:
        return ''
    }
  }

  return {
    competitionId,
    competition,
    teamClass
  }
}
