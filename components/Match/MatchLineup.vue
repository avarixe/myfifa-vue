<template>
  <v-container>
    <formation-view :formation="sortedPerformances">
      <match-performance
        slot="item"
        slot-scope="{ player }"
        :performance="player"
        :match="match"
        :readonly="readonly"
      ></match-performance>
    </formation-view>

    <v-layout
      v-if="substitutes.length > 0"
      row
      wrap>
      <v-flex xs12>
        <v-list id="substitutes" dense>
          <v-subheader>Substitutes</v-subheader>
          <substitute-performance
            v-for="(player, i) in substitutes"
            :key="i"
            :performance="player"
            :match="match"
            :readonly="readonly"
          ></substitute-performance>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import TeamAccessible from '@/mixins/TeamAccessible'
  import MatchAccessible from '@/mixins/MatchAccessible'
  import FormationView from '@/components/FormationView'
  import MatchPerformance from '@/components/Match/MatchPerformance'
  import SubstitutePerformance from '@/components/Match/SubstitutePerformance'

  export default {
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    components: {
      FormationView,
      MatchPerformance,
      SubstitutePerformance
    },
    computed: {
      readonly () {
        return this.team.current_date !== this.match.date_played
      },
      substitutes () {
        return this.sortedPerformances
          .filter(p => 'start' in p && p.start > 0)
          .sort((a, b) => this.positions.indexOf(a) < this.positions.indexOf(b))
      }
    }
  }
</script>

<style scoped>
  .v-list#substitutes { background-color: transparent; }
</style>
