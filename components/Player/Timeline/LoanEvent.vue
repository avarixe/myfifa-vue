<template>
  <base-player-event
    :player="player"
    :event="event"
    :title="title"
    icon="mdi-transit-transfer"
    color="deep-orange"
    :dense="dense"
  >
    <template #heading>
      <v-chip
        v-if="!event.signedOn"
        color="error"
        small
        label
        outlined
      >
        <v-icon left small>mdi-pencil-off</v-icon>
        UNSIGNED
      </v-chip>
      <template v-if="event.startedOn > team.currentlyOn">
        Scheduled on {{ event.startedOn | formatDate }}
      </template>
      <template v-else>
        {{ event.startedOn | formatDate }} -
        <span v-if="event.endedOn < team.currentlyOn">
          {{ event.endedOn | formatDate }}
        </span>
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
      <tr v-if="event.wagePercentage">
        <td class="font-weight-bold">Wage Percentage</td>
        <td class="pl-1">{{ event.wagePercentage }}%</td>
      </tr>
      <tr v-if="event.startedOn > team.currentlyOn">
        <td class="font-weight-bold">Departs In</td>
        <td class="pl-1">{{ timeBeforeDeparture }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Duration</td>
        <td class="pl-1">{{ duration }}</td>
      </tr>
      <template v-if="event.transferFee || event.addonClause">
        <tr>
          <td colspan="2">
            <v-subheader>Loan-to-Buy Option</v-subheader>
          </td>
        </tr>
        <tr v-if="event.transferFee">
          <td class="font-weight-bold">Transfer Fee</td>
          <td class="pl-1">{{ event.transferFee | formatMoney(team.currency) }}</td>
        </tr>
        <tr v-if="event.addonClause">
          <td class="font-weight-bold">Add-On Clause</td>
          <td class="pl-1">{{ event.addonClause }}%</td>
        </tr>
      </template>
    </template>
    <template #additional-actions>
      <loan-buy-option-activator
        v-if="buyOptionAvailable"
        :player="player"
        :loan="event"
      >
        <template #activator="{ on }">
          <v-btn
            text
            small
            :color="event.origin === team.name ? 'red' : 'green'"
            v-on="on"
          >
            Activate Buy Option
          </v-btn>
        </template>
      </loan-buy-option-activator>
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
        return this.team.name === this.event.origin
          ? `Loan at ${this.event.destination}`
          : `Loan from ${this.event.origin}`
      },
      timeBeforeDeparture () {
        return formatDistance(
          parseISO(this.event.startedOn),
          parseISO(this.team.currentlyOn)
        )
      },
      duration () {
        return formatDistance(
          parseISO(this.event.endedOn),
          parseISO(this.event.startedOn)
        )
      },
      buyOptionAvailable () {
        return this.event.signedOn &&
          this.event.endedOn > this.team.currentlyOn &&
          (this.event.transferFee || this.event.addonClause)
      }
    }
  }
</script>
