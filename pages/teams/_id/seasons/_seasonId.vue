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
        <match-results
          :season-data="seasonData"
        ></match-results>
      </v-flex>

      <v-flex xs12>
        <player-grid
          :season="season"
          :season-data="seasonData"
        ></player-grid>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import MatchResults from '@/components/Season/MatchResults'
  import PlayerGrid from '@/components/Season/PlayerGrid'
  import TeamAccessible from '@/mixins/TeamAccessible'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    components: {
      MatchResults,
      PlayerGrid
    },
    mixins: [ TeamAccessible ],
    async asyncData ({ store, params }) {
      const { data } = await store.dispatch('entities/teams/ANALYZE_SEASON', {
        teamId: params.id,
        season: params.seasonId
      })
      return { seasonData: data }
    },
    head () {
      return {
        title: `${this.seasonLabel(this.season)} Season`
      }
    },
    computed: {
      season () { return this.$route.params.seasonId }
    },
    async fetch ({ store, params }) {
      await store.dispatch('entities/teams/GET', {
        teamId: params.id,
        activate: true
      })
    }
  }
</script>
