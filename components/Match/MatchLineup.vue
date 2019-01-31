<template>
  <v-container>
    <formation-view
      :formation="sortedCaps"
    >
      <match-cap
        slot="item"
        slot-scope="{ player }"
        :cap="player"
        :match="match"
        :readonly="readonly"
      />
    </formation-view>

    <v-layout
      v-if="substitutes.length > 0"
      row
      wrap
    >
      <v-flex
        xs12
      >
        <v-list
          id="substitutes"
          dense
        >
          <v-subheader
            v-text="'Substitutes'"
          />
          <substitute-cap
            v-for="cap in substitutes"
            :key="cap.id"
            :cap="cap"
            :match="match"
            :readonly="readonly"
          />
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {
    TeamAccessible,
    MatchAccessible
  } from '@/mixins'
  import {
    FormationView
  } from '@/helpers'
  import MatchCap from './MatchCap'
  import SubstituteCap from './SubstituteCap'

  export default {
    components: {
      FormationView,
      MatchCap,
      SubstituteCap
    },
    mixins: [
      TeamAccessible,
      MatchAccessible
    ],
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
