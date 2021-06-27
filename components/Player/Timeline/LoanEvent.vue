<template>
  <base-player-event
    :player="player"
    :event="event"
    :title="title"
    icon="mdi-transit-transfer"
    color="indigo"
    :dense="dense"
  >
    <template #heading>
      <template v-if="event.started_on > team.currently_on">
        Scheduled on {{ event.started_on | formatDate }}
      </template>
      <template v-else>
        {{ event.started_on | formatDate }} -
        <span v-if="event.ended_on">{{ event.ended_on | formatDate }}</span>
        <span v-else>Present</span>
      </template>
    </template>
    <template #details>
      <tr>
        <td class="font-weight-bold">Origin</td>
        <td class="pl-1">{{ event.origin }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Destination</td>
        <td class="pl-1">{{ event.destination }}</td>
      </tr>
      <tr v-if="event.wage_percentage">
        <td class="font-weight-bold">Wage Percentage</td>
        <td class="pl-1">{{ event.wage_percentage }}%</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Duration</td>
        <td class="pl-1">{{ duration }}</td>
      </tr>
    </template>
  </base-player-event>
</template>

<script>
  import { formatDistance, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'LoanEvent',
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      event: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    computed: {
      title () {
        return this.team.title === this.event.origin
          ? `Loan at ${this.event.destination}`
          : `Loan from ${this.event.origin}`
      },
      length () {
        return formatDistance(
          parseISO(this.event.ended_on || this.team.currently_on),
          parseISO(this.event.started_on)
        )
      },
      duration () {
        return this.event.started_on > this.team.currently_on
          ? `Departs in ${this.length}`
          : `Away for ${this.length}`
      }
    }
  }
</script>
