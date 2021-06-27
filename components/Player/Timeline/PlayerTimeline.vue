<template>
  <v-card flat>
    <v-card-text>
      <v-timeline :dense="dense">
        <template v-if="events.length > 0">
          <template v-for="event in events">
            <component
              :is="`${event.type}-event`"
              :key="`${event.type}-${event.id}`"
              :player="player"
              :event="event"
              :dense="dense"
            />
          </template>
        </template>
        <v-timeline-item
          v-else
          color="grey"
          icon="mdi-calendar"
          fill-dot
        >
          <div class="mt-2">No Player Events</div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<script>
  import orderBy from 'lodash.orderby'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'PlayerTimeline',
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true }
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
