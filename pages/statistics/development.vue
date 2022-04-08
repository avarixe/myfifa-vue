<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="{ name: 'players', query: { teamId } }"
          nuxt
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Back
        </v-btn>
        <v-btn
          :to="{ name: 'statistics-performances', query: { teamId } }"
          nuxt
          color="purple"
          dark
        >
          <v-icon left>mdi-numeric</v-icon>
          Performances
        </v-btn>
      </v-col>
      <v-col cols="12">
        <player-development-grid :stats="playerDevelopmentStats" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import { playerFragment, playerDevelopmentStatsFragment } from '@/fragments'

  export default {
    name: 'DevelopmentStatisticsPage',
    mixins: [
      TeamAccessible
    ],
    transition: 'fade-transition',
    async asyncData ({ route, store, $graphql, redirect }) {
      const { teamId } = route.query

      if (teamId) {
        const query = gql`
          query fetchPlayersPage($teamId: ID!) {
            team(id: $teamId) {
              players { ...PlayerData }
              playerDevelopmentStats { ...PlayerDevelopmentStatsData }
            }
          }
          ${playerFragment}
          ${playerDevelopmentStatsFragment}
        `

        const { team: { players, playerDevelopmentStats } } =
          await $graphql.default.request(query, { teamId: parseInt(teamId) })

        await store.$db().model('Player').insert({ data: players })

        return { playerDevelopmentStats }
      } else {
        redirect('/')
      }
    },
    async fetch () {
      this.setPage({
        title: `${this.team.name} - Player Development`,
        headline: 'Player Development'
      })
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
