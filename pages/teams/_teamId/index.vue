<template>
  <div class="pt-5">
    <team-toolbar :team="team"></team-toolbar>
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
  </div>
</template>

<script>
  import TeamAction from '@/mixins/TeamAction'
  import TeamToolbar from '@/components/Team/TeamToolbar'
  import PlayerPanel from '@/components/Player/PlayerPanel'
  import MatchPanel from '@/components/Match/MatchPanel'
  import SquadPanel from '@/components/Squad/SquadPanel'

  export default {
    components: {
      TeamToolbar,
      PlayerPanel,
      MatchPanel,
      SquadPanel
    },
    middleware: 'authenticated',
    mixins: [ TeamAction ],
    async fetch ({ store, params }) {
      await store.dispatch('team/get', { teamId: params.teamId, activate: true })
    }
  }
</script>
