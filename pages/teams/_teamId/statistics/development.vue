<script>
  import { reactive, useContext, useFetch, useStore } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { useTeam } from '@/composables'
  import { playerFragment, playerDevelopmentStatsFragment } from '@/fragments'

  export default {
    name: 'DevelopmentStatisticsPage',
    setup () {
      const { $graphql } = useContext()
      const store = useStore()
      const { teamId } = useTeam()
      const stats = reactive([])
      useFetch(async () => {
        const query = gql`
          query fetchPlayersPage($teamId: ID!) {
            team(id: $teamId) {
              name
              players { ...PlayerData }
              playerDevelopmentStats { ...PlayerDevelopmentStatsData }
            }
          }
          ${playerFragment}
          ${playerDevelopmentStatsFragment}
        `

        const { team: { name, players, playerDevelopmentStats } } =
          await $graphql.default.request(query, { teamId: teamId.value })

        await store.$db().model('Player').insert({ data: players })

        store.commit('app/setPage', {
          title: `${name} - Player Development`,
          headline: 'Player Development'
        })

        playerDevelopmentStats.forEach(stat => stats.push(stat))
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
          :to="`/teams/${teamId}/statistics/performances`"
          nuxt
          color="purple"
          dark
        >
          <v-icon left>mdi-numeric</v-icon>
          Performances
        </v-btn>
      </v-col>
      <v-col cols="12">
        <player-development-grid :stats="stats" />
      </v-col>
    </v-row>
  </v-container>
</template>
