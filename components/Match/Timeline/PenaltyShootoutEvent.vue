<script>
  import { toRefs, computed } from '@nuxtjs/composition-api'

  export default {
    name: 'PenaltyShootoutEvent',
    props: {
      match: { type: Object, required: true },
      event: { type: Object, required: true },
      readonly: { type: Boolean, default: false }
    },
    setup (props) {
      const { event, match } = toRefs(props)
      const winner = computed(() => {
        return event.value.homeScore > event.value.awayScore
          ? match.value.home
          : match.value.away
      })

      return { winner }
    }
  }
</script>

<template>
  <base-match-event
    :match="match"
    :event="event"
    :readonly="readonly"
  >
    <div :class="{ 'font-weight-bold': match.home === winner }">
      {{ event.homeScore }} - {{ match.home }}
    </div>
    <div :class="{ 'font-weight-bold': match.away === winner }">
      {{ event.awayScore }} - {{ match.away }}
    </div>
  </base-match-event>
</template>
