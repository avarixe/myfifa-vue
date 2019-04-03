<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
      >
        <v-btn
          v-if="season > 0"
          :to="previousSeasonLink"
          nuxt
        >Previous Season</v-btn>
        <v-btn
          :to="nextSeasonLink"
          nuxt
        >Next Season</v-btn>
      </v-flex>
      <v-flex
        xs12
      >
        <season-results-chart
          :season-data="seasonData"
        />
      </v-flex>

      <v-flex
        xs12
      >
        <player-grid
          :season="season"
          :season-data="seasonData"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import SeasonResultsChart from '@/components/Season/SeasonResultsChart'
  import SeasonResultsTable from '@/components/Season/SeasonResultsTable'
  import PlayerGrid from '@/components/Season/PlayerGrid'
  import {
    TeamAccessible
  } from '@/mixins'

  export default {
    layout: 'team',
    middleware: 'authenticated',
    components: {
      SeasonResultsChart,
      SeasonResultsTable,
      PlayerGrid
    },
    mixins: [ TeamAccessible ],
    async asyncData ({ store, params }) {
      const { data } = await store.dispatch('entities/teams/ANALYZE_SEASON', params)
      return { seasonData: data }
    },
    head () {
      return {
        title: this.title
      }
    },
    computed: {
      title () {
        return `${this.seasonLabel(this.season)} Season`
      },
      season () {
        return this.$route.params.season
      },
      previousSeasonLink () {
        return {
          name: 'teams-teamId-seasons-season',
          params: {
            teamId: this.team.id,
            season: this.season - 1
          }
        }
      },
      nextSeasonLink () {
        return {
          name: 'teams-teamId-seasons-season',
          params: {
            teamId: this.team.id,
            season: this.season + 1
          }
        }
      }
    },
    mounted () {
      this.$store.commit('app/SET_TITLE', this.title)
    }
  }
</script>
