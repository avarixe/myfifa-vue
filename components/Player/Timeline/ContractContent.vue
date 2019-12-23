<template lang="pug">
  table
    tbody
      tr
        td.font-weight-bold Wage
        td.pl-1 {{ contract.wage | formatMoney(team.currency) }}
      tr
        td.font-weight-bold Signing Bonus
        td.pl-1 {{ contract.signing_bonus | formatMoney(team.currency) }}
      tr(v-if="contract.performance_bonus")
        td.font-weight-bold Performance Bonus
        td.pl-1
          | {{ contract.performance_bonus | formatMoney(team.currency) }}
          | if {{ contract.bonus_req }} {{ contract.bonus_req_type }}
      tr(v-if="contract.release_clause")
        td.font-weight-bold Release Clause
        td.pl-1 {{ contract.release_clause | formatMoney(team.currency) }}
</template>

<script>
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'ContractContent',
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
