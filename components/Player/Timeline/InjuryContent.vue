<template>
  <table>
    <tbody>
      <tr>
        <td class="font-weight-bold">Duration</td>
        <td class="pl-1">Injured for {{ length }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { mixins, Component, Prop } from 'nuxt-property-decorator'
  import { distanceInWords } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  @Component
  export default class InjuryContent extends mixins(TeamAccessible) {
    @Prop({ type: Object, required: true }) item

    get injury () {
      return this.item.data
    }

    get length () {
      return distanceInWords(
        this.injury.start_date,
        this.injury.end_date || this.team.current_date
      )
    }
  }
</script>
