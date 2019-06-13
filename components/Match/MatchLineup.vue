<template>
  <v-container>
    <formation-view :formation="sortedCaps">
      <template #item="{ player }">
        <cap-view
          :cap="player"
          :match="match"
          :readonly="readonly"
        />
      </template>
    </formation-view>

    <v-layout
      v-if="substitutes.length > 0"
      wrap
    >
      <v-flex xs12>
        <v-list dense>
          <v-subheader>Substitutes</v-subheader>
          <cap-sub-view
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
  import { FormationView } from '@/helpers'
  import CapView from '@/components/Cap/CapView'
  import CapSubView from '@/components/Cap/CapSubView'

  export default {
    components: {
      FormationView,
      CapView,
      CapSubView
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
