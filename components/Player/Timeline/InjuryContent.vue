<template>
  <v-layout row wrap>
    <v-flex xs12>
      Injured for {{ length }}
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