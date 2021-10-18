<script>
  import { toRef, computed, useContext } from '@nuxtjs/composition-api'
  import orderBy from 'lodash.orderby'

  export default {
    name: 'PlayerTimeline',
    props: {
      player: { type: Object, required: true }
    },
    setup (props) {
      const player = toRef(props, 'player')
      const events = computed(() => orderBy([
        ...player.value.contracts,
        ...player.value.injuries,
        ...player.value.loans,
        ...player.value.transfers
      ], ['date', 'createdAt'], ['desc', 'desc']))

      const { $vuetify } = useContext()
      const dense = computed(() => {
        switch ($vuetify.breakpoint.name) {
          case 'sm':
          case 'md':
            return false
          default:
            return true
        }
      })

      return {
        events,
        dense
      }
    }
  }
</script>

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
