<template>
  <table>
    <tbody>
      <tr>
        <td
          class="font-weight-bold"
          v-text="'Duration'"
        />
        <td
          class="pl-1"
          v-text="`Away for ${length}`"
        />
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { distanceInWords } from 'date-fns'
  import TeamAccessible from '@/mixins/TeamAccessible'

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
