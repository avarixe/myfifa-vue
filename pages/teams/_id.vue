<template>
  <v-container fluid grid-list-lg>
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
  import TeamAction from '@/mixins/TeamAction'
  import PlayerPanel from '@/components/Player/PlayerPanel'
  import MatchPanel from '@/components/Match/MatchPanel'
  import SquadPanel from '@/components/Squad/SquadPanel'

  export default {
    layout: 'team',
    components: {
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
