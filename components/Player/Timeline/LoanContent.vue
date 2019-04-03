<template>
  <table>
    <tbody>
      <tr>
        <td
          class="font-weight-bold"
        >Duration</td>
        <td
          class="pl-1"
        >Away for {{ length }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import {
    distanceInWords
  } from 'date-fns'
  import {
    TeamAccessible
  } from '@/mixins'

  export default {
    mixins: [ TeamAccessible ],
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      loan () {
        return this.item.data
      },
      length () {
        return distanceInWords(
          this.loan.start_date,
          this.loan.end_date || this.team.current_date
        )
      }
    }
  }
</script>
