<template>
  <v-list dense>
    <v-subheader>Lineup</v-subheader>
    <formation-view :formation="sortedPerformances">
      <template slot="item" slot-scope="{ player }">
        <match-performance
          :performance="player"
          :match="match"
          :readonly="team.current_date !== match.date_played"
        ></match-performance>
      </template>
    </formation-view>
  </v-list>
</template>

<script>
  import { mapState } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import MatchAccessible from '@/mixins/MatchAccessible'
  import MatchPerformance from '@/components/Match/MatchPerformance'
  import FormationView from '@/components/FormationView'

  export default {
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    components: {
      MatchPerformance,
      FormationView
    }
  }
</script>

<style scoped>
  .v-list { background-color: transparent; }
</style>
