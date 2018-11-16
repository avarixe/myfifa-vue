<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <div class="display-1">{{ seasonLabel(season) }} Season</div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <player-grid :season="season"></player-grid>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import PlayerGrid from '@/components/Season/PlayerGrid'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    components: {
      PlayerGrid
    },
    mixins: [ TeamAccessible ],
    computed: {
      season () {
        return this.$route.params.seasonId
      }
    },
    async fetch ({ store, params }) {
      store.state.team.currentId !== params.id &&
      await store.dispatch('team/get', { teamId: params.id, activate: true })
    }
  }
</script>
