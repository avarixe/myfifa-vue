<script>
  import { reactive, useContext, useFetch, useStore } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { useTeam } from '@/composables'
  import {
    playerFragment,
    playerPerformanceStatsFragment,
    competitionFragment
  } from '@/fragments'

  export default {
    name: 'PerformancesStatisticsPage',
    setup () {
      const { $graphql } = useContext()
      const store = useStore()
      const { teamId } = useTeam()
      const stats = reactive({ value: [] })
      useFetch(async () => {
        const query = gql`
          query fetchPlayersPage($teamId: ID!) {
            team(id: $teamId) {
              players { ...PlayerData }
              playerPerformanceStats { ...PlayerPerformanceStatsData }
              competitions { ...CompetitionData }
            }
          }
          ${playerFragment}
          ${playerPerformanceStatsFragment}
          ${competitionFragment}
        `

        const { team: { name, players, playerPerformanceStats, competitions } } =
          await $graphql.default.request(query, { teamId: teamId.value })

        await Promise.all([
          store.$db().model('Player').insert({ data: players }),
          store.$db().model('Competition').insert({ data: competitions })
        ])

        store.commit('app/setPage', {
          title: `${name} - Player Performances`,
          headline: 'Player Performances'
        })

        stats.value = playerPerformanceStats
      })

      return {
        teamId,
        stats
      }
    }
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="`/teams/${teamId}/players`"
          nuxt
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Back
        </v-btn>
        <v-btn
          :to="`/teams/${teamId}/statistics/development`"
          nuxt
          color="teal"
          dark
        >
          <v-icon left>mdi-trending-up</v-icon>
          Development
        </v-btn>
      </v-col>
      <v-col cols="12">
        <player-performance-grid :stats="stats.value" />
      </v-col>
    </v-row>
  </v-container>
</template>
