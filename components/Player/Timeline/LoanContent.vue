<template>
  <table>
    <tbody>
      <tr>
        <td class="font-weight-bold">Duration</td>
        <td class="pl-1">Away for {{ length }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { distanceInWords } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  @Component
  export default class LoanContent extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) item

    get loan () {
      return this.item.data
    }

    get length () {
      return distanceInWords(
        this.loan.started_on,
        this.loan.ended_on || this.team.currently_on
      )
    }
  }
</script>
