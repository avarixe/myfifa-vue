<template lang="pug">
  v-timeline-item(
    :icon="`mdi-${icon}`"
    :color="color"
    fill-dot
    right
  )
    template(#opposite)
      span.headline.font-weight-bold(:class="`${color}--text`")
        | Transfer
      h4.title.font-weight-light.mb-3(:class="`${color}--text`")
        | {{ transfer.moved_on | formatDate }}
    v-card(dense flat)
      v-card-title.py-0(v-if="dense")
        div(:class="`${color}--text`")
          span.title.font-weight-bold
            | Transfer
          h4.body-2.font-weight-light.mb-3(
            :class="`${color}--text`"
          ) {{ transfer.moved_on | formatDate }}
      v-card-text.py-0
        table
          tbody
            tr
              td.font-weight-bold Origin
              td.pl-1 {{ transfer.origin }}
            tr
              td.font-weight-bold Destination
              td.pl-1 {{ transfer.destination }}
            tr
              td.font-weight-bold Transfer Fee
              td.pl-1 {{ transfer.fee | formatMoney(team.currency) }}
            tr(v-if="transfer.traded_player")
              td.font-weight-bold Traded Player
              td.pl-1 {{ transfer.traded_player }}
            tr(v-if="transfer.addon_clause")
              td.font-weight-bold Add-On Clause
              td.pl-1 {{ transfer.addon_clause }}%
      v-card-actions
        transfer-form(:player="player" :record="transfer")
          template(#default="{ on }")
            v-btn(
              text
              small
              color="orange"
              v-on="on"
            ) Edit
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
