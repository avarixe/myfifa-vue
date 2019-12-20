<template lang="pug">
  v-timeline(v-if="events.length > 0 || match.penalty_shootout" dense)
    match-timeline-item(
      v-for="(event, i) in events"
      :key="`${event.id}_${i}`"
      :event="event"
      :match="match"
    )
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import orderBy from 'lodash.orderby'
  import MatchTimelineItem from './Item'
  import { TeamAccessible } from '@/mixins'

  @Component({
    components: {
      MatchTimelineItem
    }
  })
  export default class MatchTimeline extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) match

    get events () {
      const events = orderBy([
        ...this.match.bookings,
        ...this.match.substitutions,
        ...this.match.goals
      ], 'minute', 'asc')

      if (this.match.penalty_shootout) {
        events.push(this.match.penalty_shootout)
      }

      return events
    }
  }
</script>

<style scoped>
  .v-card > .container {
    padding: 8px;
  }
</style>
