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
          v-text="`Injured for ${length}`"
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
      injury () {
        return this.item.data
      },
      length () {
        return distanceInWords(
          this.injury.start_date,
          this.injury.end_date || this.team.current_date
        )
      }
    }
  }
</script>
