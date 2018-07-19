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
          <player-panel></player-panel>
        </v-flex>
        <v-flex xs12>
          <match-panel></match-panel>
        </v-flex>
        <v-flex xs12>
          <squad-panel></squad-panel>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import TeamCalendar from '@/components/Team/TeamCalendar'
  import PlayerPanel from '@/components/Player/PlayerPanel'
  import MatchPanel from '@/components/Match/MatchPanel'
  import SquadPanel from '@/components/Squad/SquadPanel'

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
      'player-panel': PlayerPanel,
      'match-panel': MatchPanel,
      'squad-panel': SquadPanel
    }
  }
</script>
