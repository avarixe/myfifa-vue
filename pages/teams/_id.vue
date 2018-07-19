<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm8 md4>
        <v-flex xs12>
          <v-slide-x-transition>
            <v-card>
              <team-calendar :team="team"></team-calendar>
            </v-card>
          </v-slide-x-transition>
        </v-flex>
      </v-flex>
      <v-flex xs12 md8>
        <v-flex xs12>
          <players-panel></players-panel>
        </v-flex>
        <v-flex xs12>
          <matches-panel></matches-panel>
        </v-flex>
        <v-flex xs12>
          <squads-panel></squads-panel>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import TeamCalendar from '@/components/teams/Calendar'
  import PlayersPanel from '@/components/players/Panel'
  import MatchesPanel from '@/components/matches/Panel'
  import SquadsPanel from '@/components/squads/Panel'

  export default {
    middleware: 'authenticated',
    async fetch ({ store, params }) {
      await store.dispatch('team/get', { teamId: params.id, activate: true })
    },
    computed: {
      ...mapState('team', {
        team: 'active'
      })
    },
    components: {
      'team-calendar': TeamCalendar,
      'players-panel': PlayersPanel,
      'matches-panel': MatchesPanel,
      'squads-panel': SquadsPanel
    }
  }
</script>
