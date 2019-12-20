<template lang="pug">
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
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { formatDistance, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  @Component
  export default class LoanContent extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) item

    get loan () {
      return this.item.data
    }

    get length () {
      return formatDistance(
        parseISO(this.loan.ended_on || this.team.currently_on),
        parseISO(this.loan.started_on)
      )
    }
  }
</script>
