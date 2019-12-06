<template>
  <table>
    <tbody>
      <tr>
        <td class="font-weight-bold">Wage</td>
        <td class="pl-1">{{ formatMoney(contract.wage) }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Signing Bonus</td>
        <td class="pl-1">{{ formatMoney(contract.signing_bonus) }}</td>
      </tr>
      <tr v-if="contract.performance_bonus">
        <td class="font-weight-bold">Performance Bonus</td>
        <td class="pl-1">
          {{ formatMoney(contract.performance_bonus) }}
          if
          {{ contract.bonus_req }}
          {{ contract.bonus_req_type }}
        </td>
      </tr>
      <tr v-if="contract.release_clause">
        <td class="font-weight-bold">Release Clause</td>
        <td class="pl-1">{{ formatMoney(contract.release_clause) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import { formatMoney } from '@/helpers'

  @Component
  export default class ContractContent extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) item

    get contract () {
      return this.item.data
    }

    formatMoney (amount) {
      return formatMoney(amount)
    }
  }
</script>
