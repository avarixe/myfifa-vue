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
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'

  @Component
  export default class TransferContent extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) item

    get transfer () {
      return this.item.data
    }
  }
</script>
