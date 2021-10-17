<script>
  import { toRef, computed } from '@nuxtjs/composition-api'
  import orderBy from 'lodash.orderby'

  export default {
    props: {
      match: { type: Object, required: true },
      readonly: { type: Boolean, default: true }
    },
    setup (props) {
      const match = toRef(props, 'match')
      const matchEvents = computed(() => {
        const events = orderBy([
          ...match.value.bookings,
          ...match.value.substitutions,
          ...match.value.goals
        ], ['minute', 'createdAt'], ['asc', 'asc'])

        if (match.value.penaltyShootout) {
          events.push(match.value.penaltyShootout)
        }

        return events
      })

      return { matchEvents }
    }
  }
</script>

<template>
  <v-timeline dense>
    <template v-if="matchEvents.length > 0">
      <template v-for="event in matchEvents">
        <component
          :is="`${event.type}-event`"
          :key="`${event.type}-${event.id}`"
          :event="event"
          :match="match"
          :readonly="readonly"
        />
      </template>
    </template>
    <v-timeline-item
      v-else
      color="grey"
      icon="mdi-timer"
      fill-dot
    >
      <div class="mt-2">No Match Events</div>
    </v-timeline-item>
  </v-timeline>
</template>

<style scoped>
  .v-card > .container {
    padding: 8px;
  }
</style>
