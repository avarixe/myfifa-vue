import { computed, useRoute, useStore } from '@nuxtjs/composition-api'
import { addYears, differenceInYears, format, parseISO } from 'date-fns'

export default () => {
  const route = useRoute()
  const teamId = computed(() => route.value.params.teamId)

  const store = useStore()
  const team = computed(() => store.$db().model('Team').find(teamId.value))

  const currentSeason = computed(() => {
    if (team.value) {
      const date = parseISO(team.value.startedOn)
      const currentDate = parseISO(team.value.currentlyOn)
      return differenceInYears(currentDate, date)
    } else {
      return 0
    }
  })

  const seasonStart = computed(() => {
    if (team.value) {
      const date = parseISO(team.value.startedOn)
      return format(addYears(date, currentSeason.value), 'yyyy-MM-dd')
    } else {
      return null
    }
  })

  const seasonEnd = computed(() => {
    if (team.value) {
      const date = parseISO(seasonStart.value)
      return format(addYears(date, 1), 'yyyy-MM-dd')
    } else {
      return null
    }
  })

  const seasonLabel = season => {
    const start = addYears(parseISO(team.value.startedOn), season)
    const end = addYears(start, 1)
    return `${format(start, 'yyyy')} - ${format(end, 'yyyy')}`
  }

  return {
    teamId,
    team,
    currentSeason,
    seasonStart,
    seasonEnd,
    seasonLabel
  }
}
