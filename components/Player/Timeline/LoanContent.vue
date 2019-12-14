<template>
  <table>
    <tbody>
      <tr>
        <td class="font-weight-bold">Origin</td>
        <td class="pl-1">{{ loan.origin }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Destination</td>
        <td class="pl-1">{{ loan.destination }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Duration</td>
        <td class="pl-1">Away for {{ length }}</td>
      </tr>
    </tbody>
  </table>
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
