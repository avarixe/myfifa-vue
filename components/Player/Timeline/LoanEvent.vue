<template lang="pug">
  v-timeline-item(
    icon="mdi-transit-transfer"
    color="indigo"
    fill-dot
    right
  )
    template(#opposite)
      span.headline.font-weight-bold.indigo--text
        | Loan at {{ loan.destination }}
      h4.title.font-weight-light.mb-3.indigo--text
        | {{ loan.started_on | formatDate }}
        | -
        template(v-if="loan.ended_on")
          | {{ loan.ended_on | formatDate }}
        template(v-else)
          | Present
    v-card(dense flat)
      v-card-title.py-0(v-if="dense")
        .indigo--text
          span.title.font-weight-bold
            | Loan at {{ loan.destination }}
          h4.body-2.font-weight-light.mb-3
            | {{ loan.started_on | formatDate }}
            | -
            template(v-if="loan.ended_on")
              | {{ loan.ended_on | formatDate }}
            template(v-else)
              | Present
      v-card-text.py-0
        table
          tbody
            tr
              td.font-weight-bold Origin
              td.pl-1 {{ loan.origin }}
            tr
              td.font-weight-bold Destination
              td.pl-1 {{ loan.destination }}
            tr
              td.font-weight-bold Duration
              td.pl-1 Away for {{ length }}
      v-card-actions
        loan-form(:player="player" :record="loan")
          template(#default="{ on }")
            v-btn(
              text
              small
              color="orange"
              v-on="on"
            ) Edit
</template>

<script>
  import { formatDistance, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'
  import LoanForm from '@/components/Loan/Form'

  export default {
    name: 'LoanEvent',
    components: {
      LoanForm
    },
    mixins: [
      TeamAccessible
    ],
    props: {
      player: { type: Object, required: true },
      loan: { type: Object, required: true },
      dense: { type: Boolean, default: false }
    },
    computed: {
      length () {
        return formatDistance(
          parseISO(this.loan.ended_on || this.team.currently_on),
          parseISO(this.loan.started_on)
        )
      }
    }
  }
</script>
