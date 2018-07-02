<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm8 md4>
        <v-flex xs12>
          <v-slide-x-transition>
            <v-card>
              <team-calendar></team-calendar>
            </v-card>
          </v-slide-x-transition>
        </v-flex>
      </v-flex>
      <v-flex xs12 md8>
        <v-flex xs12>
          <players-panel :team-id="teamId"></players-panel>
        </v-flex>
        <v-flex xs12>
          <matches-panel :team-id="teamId"></matches-panel>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamCalendar from '@/components/teams/calendar'
  import PlayersPanel from '@/components/players'
  import MatchesPanel from '@/components/matches'

  export default {
    computed: {
      teamId () {
        return this.$route.params.team_id
      }
    },
    components: {
      'team-calendar': TeamCalendar,
      'players-panel': PlayersPanel,
      'matches-panel': MatchesPanel
    }
  }
</script>
