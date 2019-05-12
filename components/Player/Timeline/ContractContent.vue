<template>
  <table>
    <tbody>
      <tr>
        <td class="font-weight-bold">Wage</td>
        <td class="pl-1">{{ $_formatMoney(contract.wage) }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Signing Bonus</td>
        <td class="pl-1">{{ $_formatMoney(contract.signing_bonus) }}</td>
      </tr>
      <tr v-if="contract.performance_bonus">
        <td class="font-weight-bold">Performance Bonus</td>
        <td class="pl-1">
          {{ $_formatMoney(contract.performance_bonus) }}
          if
          {{ contract.bonus_req }}
          {{contract.bonus_req_type }}
        </td>
      </tr>
      <tr v-if="contract.release_clause">
        <td class="font-weight-bold">Release Clause</td>
        <td class="pl-1">{{ $_formatMoney(contract.release_clause) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
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
      contract () {
        return this.item.data
      }
    }
  }
</script>
