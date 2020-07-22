<template>
  <v-timeline dense>
    <template v-if="events.length > 0 || match.penalty_shootout">
      <match-timeline-item
        v-for="(event, i) in events"
        :key="`${event.id}_${i}`"
        :event="event"
        :match="match"
        :readonly="readonly"
      />
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

<script>
  import orderBy from 'lodash.orderby'
  import { TeamAccessible } from '@/mixins'

  export default {
    mixins: [
      TeamAccessible
    ],
    props: {
      match: { type: Object, required: true }
    },
    computed: {
      events () {
        const events = orderBy([
          ...this.match.bookings,
          ...this.match.substitutions,
          ...this.match.goals
        ], 'minute', 'asc')

        if (this.match.penalty_shootout) {
          events.push(this.match.penalty_shootout)
        }

        return events
      },
      readonly () {
        return this.team.currently_on !== this.match.played_on
      }
    }
  }
</script>

<style scoped>
  .v-card > .container {
    padding: 8px;
  }
</style>
