<template>
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
</template>

<script>
  import { mapState } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import MatchAccessible from '@/mixins/MatchAccessible'
  import MatchPerformance from '@/components/Match/MatchPerformance'

  export default {
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    components: {
      MatchPerformance
    }
  }
</script>

<style scoped>
  .v-list { background-color: transparent; }
</style>
