<template>
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
