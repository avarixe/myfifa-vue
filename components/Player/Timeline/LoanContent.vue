<template>
  <v-layout row wrap>
    <v-flex xs12>
      Loaned for {{ length }}
    </v-flex>
  </v-layout>
</template>

<script>
  import { distanceInWords } from 'date-fns'
  import TeamAction from '@/mixins/TeamAction'

  export default {
    mixins: [
      TeamAction
    ],
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