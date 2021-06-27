<template>
  <base-player-event
    :player="player"
    :event="event"
    title="Contract"
    icon="mdi-file-document"
    color="blue"
    :dense="dense"
  >
    <template #heading>
      {{ event.started_on | formatDate }} - {{ event.ended_on | formatDate }}
      <span
        v-if="event.conclusion && event.ended_on <= team.currently_on"
        class="pl-1"
        v-text="`(${event.conclusion})`"
      />
    </template>
    <template #details>
      <tr>
        <td class="font-weight-bold">Wage</td>
        <td class="pl-1">
          {{ event.wage | formatMoney(team.currency) }}
        </td>
      </tr>
      <tr>
        <td class="font-weight-bold">Signing Bonus</td>
        <td class="pl-1">
          {{ event.signing_bonus | formatMoney(team.currency) }}
        </td>
      </tr>
      <tr v-if="event.performance_bonus">
        <td class="font-weight-bold">Performance Bonus</td>
        <td class="pl-1">
          {{ event.performance_bonus | formatMoney(team.currency) }}
          if {{ event.bonus_req }} {{ event.bonus_req_type }}
        </td>
      </tr>
      <tr v-if="event.release_clause">
        <td class="font-weight-bold">Release Clause</td>
        <td class="pl-1">
          {{ event.release_clause | formatMoney(team.currency) }}
        </td>
      </tr>
    </template>
  </base-player-event>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'ContractEvent',
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      event: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    }
  }
</script>
