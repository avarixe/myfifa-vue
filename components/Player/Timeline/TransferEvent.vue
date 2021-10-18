<script>
  import { toRef, computed } from '@nuxtjs/composition-api'
  import { useTeam } from '@/composables'

  export default {
    name: 'TransferEvent',
    props: {
      player: { type: Object, required: true },
      event: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    setup (props) {
      const event = toRef(props, 'event')
      const { team } = useTeam()

      const transferOut = computed(() =>
        event.value.origin === team.value.name
      )
      const title = computed(() => {
        return transferOut.value
          ? `Transfer to ${event.value.destination}`
          : `Transfer from ${event.value.origin}`
      })
      const icon = computed(() =>
        `mdi-airplane-${transferOut.value ? 'takeoff' : 'landing'}`
      )
      const color = computed(() => transferOut.value ? 'red' : 'green')

      return {
        team,
        transferOut,
        title,
        icon,
        color
      }
    }
  }
</script>

<template>
  <base-player-event
    :player="player"
    :event="event"
    :title="title"
    :icon="icon"
    :color="color"
    :dense="dense"
  >
    <template #heading>
      {{ event.movedOn | formatDate }}
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
      <tr>
        <td class="font-weight-bold">Transfer Fee</td>
        <td class="pl-1">{{ event.fee | formatMoney(team.currency) }}</td>
      </tr>
      <tr v-if="event.tradedPlayer">
        <td class="font-weight-bold">Traded Player</td>
        <td class="pl-1">{{ event.tradedPlayer }}</td>
      </tr>
      <tr v-if="event.addonClause">
        <td class="font-weight-bold">Add-On Clause</td>
        <td class="pl-1">{{ event.addonClause }}%</td>
      </tr>
    </template>
  </base-player-event>
</template>
