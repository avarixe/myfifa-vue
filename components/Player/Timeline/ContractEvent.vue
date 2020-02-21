<template lang="pug">
  v-timeline-item(
    icon="mdi-file-document"
    color="blue"
    fill-dot
    right
  )
    template(#opposite)
      span.headline.font-weight-bold.blue--text
        | Contract
      h4.title.font-weight-light.mb-3.blue--text
        | {{ contract.started_on | formatDate }}
        | -
        | {{ contract.ended_on | formatDate }}
        span.pl-1(v-if="contract.conclusion") ({{ contract.conclusion }})
    v-card(dense flat)
      v-card-title.py-0(v-if="dense")
        .blue--text
          span.title.font-weight-bold
            | Contract
          h4.body-2.font-weight-light.mb-3
            | {{ contract.started_on | formatDate }}
            | -
            | {{ contract.ended_on | formatDate }}
            span.pl-1(v-if="contract.conclusion") ({{ contract.conclusion }})
      v-card-text.py-0
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
      v-card-actions
        contract-form(:player="player" :record="contract")
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
  import ContractForm from '@/components/Contract/Form'

  export default {
    name: 'ContractEvent',
    components: {
      ContractForm
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      contract: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    }
  }
</script>
