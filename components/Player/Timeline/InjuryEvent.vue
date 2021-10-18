<script>
  import { toRef, computed } from '@nuxtjs/composition-api'
  import { formatDistance, parseISO } from 'date-fns'
  import { useTeam } from '@/composables'

  export default {
    name: 'InjuryEvent',
    props: {
      player: { type: Object, required: true },
      event: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    setup (props) {
      const event = toRef(props, 'event')
      const length = computed(() => formatDistance(
        parseISO(event.value.endedOn),
        parseISO(event.value.startedOn)
      ))

      const { team } = useTeam()
      return {
        length,
        team
      }
    }
  }
</script>

<template>
  <base-player-event
    :player="player"
    :event="event"
    :title="`${event.description} Injury`"
    icon="mdi-ambulance"
    color="pink"
    :dense="dense"
  >
    <template #heading>
      {{ event.startedOn | formatDate }} -
      <span v-if="event.endedOn < team.currentlyOn">
        {{ event.endedOn | formatDate }}
      </span>
      <span v-else>Present</span>
    </template>
    <template #details>
      <tr>
        <td class="font-weight-bold">Duration</td>
        <td class="pl-1">Injured for {{ length }}</td>
      </tr>
    </template>
  </base-player-event>
</template>
