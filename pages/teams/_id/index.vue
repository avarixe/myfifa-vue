<template>
  <v-container fluid grid-list-lg>
    <team-socket-listener></team-socket-listener>
    <v-layout row wrap>
      <v-flex xs12>
        <player-panel></player-panel>
      </v-flex>
      <v-flex xs12>
        <match-panel></match-panel>
      </v-flex>
      <v-flex xs12>
        <squad-panel></squad-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TeamSocketListener from '@/components/Team/TeamSocketListener'
  import PlayerPanel from '@/components/Player/PlayerPanel'
  import MatchPanel from '@/components/Match/MatchPanel'
  import SquadPanel from '@/components/Squad/SquadPanel'
  import TeamAction from '@/mixins/TeamAction'

  export default {
    layout: 'team',
    components: {
      TeamSocketListener,
      PlayerPanel,
      MatchPanel,
      SquadPanel
    },
    middleware: 'authenticated',
    mixins: [ TeamAction ],
    async fetch ({ store, params }) {
      await store.dispatch('team/get', {
        teamId: params.id,
        activate: true
      })
    }
  }
</script>
