<template>
  <v-flex xs12 sm6>
    <v-list dense>
      <v-subheader>Lineup</v-subheader>
      <match-performance
        v-for="(performance, i) in sortedPerformances"
        :key="i"
        :performance="performance"
        :match="match"
        :readonly="team.current_date !== match.date_played"
      ></match-performance>
    </v-list>
  </v-flex>
</template>

<script>
  import { mapState } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import MatchPerformance from '@/components/Match/MatchPerformance'

  export default {
    mixins: [ TeamAccessible ],
    components: {
      MatchPerformance
    },
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
      ...mapState('match', [
        'positions'
      ]),
      sortedPerformances () {
        return this.match.performances.slice().sort((a, b) => {
          let aPos = this.positions.indexOf(a.pos)
          let bPos = this.positions.indexOf(b.pos)
          return aPos - bPos || a.start - b.start
        })
      }
    }
  }
</script>
