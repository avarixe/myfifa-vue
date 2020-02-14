<template lang="pug">
  v-card(flat)
    v-card-text
      v-timeline(:dense="dense")
        template(v-if="events.length > 0")
          player-timeline-item(
            v-for="(event, i) in events"
            :key="i"
            :player="player"
            :event="event"
            :dense="dense"
          )
        v-timeline-item(
          v-else
          color="grey"
          icon="mdi-calendar"
          fill-dot
        )
          .mt-2 No Player Events
</template>

<script>
  import orderBy from 'lodash.orderby'
  import PlayerTimelineItem from './Item'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'PlayerTimeline',
    components: {
      PlayerTimelineItem
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      player: {
        type: Object,
        required: true
      }
    },
    computed: {
      events () {
        return orderBy([
          ...this.player.contracts,
          ...this.player.injuries,
          ...this.player.loans,
          ...this.player.transfers
        ], 'date', 'desc')
      },
      dense () {
        switch (this.$vuetify.breakpoint.name) {
          case 'sm':
          case 'md':
            return false
          default:
            return true
        }
      }
    }
  }
</script>
