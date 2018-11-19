<template>
  <v-container>
    <formation-view :formation="sortedCaps">
      <match-cap
        slot="item"
        slot-scope="{ player }"
        :cap="player"
        :match="match"
        :readonly="readonly"
      ></match-cap>
    </formation-view>

    <v-layout
      v-if="substitutes.length > 0"
      row
      wrap>
      <v-flex xs12>
        <v-list id="substitutes" dense>
          <v-subheader>Substitutes</v-subheader>
          <substitute-cap
            v-for="(cap, i) in substitutes"
            :key="i"
            :cap="cap"
            :match="match"
            :readonly="readonly"
          ></substitute-cap>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamAccessible from '@/mixins/TeamAccessible'
  import MatchAccessible from '@/mixins/MatchAccessible'
  import FormationView from '@/components/FormationView'
  import MatchCap from '@/components/Match/MatchCap'
  import SubstituteCap from '@/components/Match/SubstituteCap'

  export default {
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
    components: {
      FormationView,
      MatchCap,
      SubstituteCap
    },
    computed: {
      readonly () {
        return this.team.current_date !== this.match.date_played
      },
      substitutes () {
        return this.sortedCaps.filter(c => 'start' in c && c.start > 0)
      }
    }
  }
</script>

<style scoped>
  .v-list#substitutes { background-color: transparent; }
</style>
