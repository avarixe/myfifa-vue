<template lang="pug">
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
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'TransferContent',
    mixins: [
      TeamAccessible
    ],
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      transfer () {
        return this.item.data
      }
    }
  }
</script>
