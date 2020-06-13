<template>
  <v-timeline-item
    :icon="`mdi-${icon}`"
    :color="color"
    fill-dot
    right
  >
    <template #opposite>
      <span :class="`text-h5 font-weight-bold ${color}--text`">
        Transfer
      </span>
      <h4 :class="`text-h6 font-weight-light mb-3 ${color}--text`">
        {{ transfer.moved_on | formatDate }}
      </h4>
    </template>
    <v-card
      dense
      flat
    >
      <v-card-title
        v-if="dense"
        class="py-0"
      >
        <div :class="`${color}--text`">
          <span class="text-h6 font-weight-bold">Transfer</span>
          <h4 :class="`text-body-2 font-weight-light mb-3 ${color}--text`">
            {{ transfer.moved_on | formatDate }}
          </h4>
        </div>
      </v-card-title>
      <v-card-text class="py-0">
        <table>
          <tbody>
            <tr>
              <td class="font-weight-bold">Origin</td>
              <td class="pl-1">{{ transfer.origin }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold">Destination</td>
              <td class="pl-1">{{ transfer.destination }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold">Transfer Fee</td>
              <td class="pl-1">{{ transfer.fee | formatMoney(team.currency) }}</td>
            </tr>
            <tr v-if="transfer.traded_player">
              <td class="font-weight-bold">Traded Player</td>
              <td class="pl-1">{{ transfer.traded_player }}</td>
            </tr>
            <tr v-if="transfer.addon_clause">
              <td class="font-weight-bold">Add-On Clause</td>
              <td class="pl-1">{{ transfer.addon_clause }}%</td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
      <v-card-actions>
        <transfer-form
          :player="player"
          :record="transfer"
        >
          <template #default="{ on }">
            <v-btn
              text
              small
              color="orange"
              v-on="on"
            >
              Edit
            </v-btn>
          </template>
        </transfer-form>
      </v-card-actions>
    </v-card>
  </v-timeline-item>
</template>

<script>
  import { TeamAccessible } from '@/mixins'
  import TransferForm from '@/components/Transfer/Form'

  export default {
    name: 'TransferEvent',
    components: {
      TransferForm
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      transfer: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    computed: {
      transferOut () {
        return this.transfer.origin === this.team.title
      },
      icon () {
        return `airplane-${this.transferOut ? 'takeoff' : 'landing'}`
      },
      color () {
        return this.transferOut ? 'red' : 'green'
      }
    }
  }
</script>
