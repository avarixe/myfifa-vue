<script>
  import { useContext, useFetch, useStore } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { useTeam } from '@/composables'
  import { teamFragment, playerFragment, contractFragment } from '@/fragments'

  export default {
    name: 'PlayersPage',
    setup () {
      const { $graphql } = useContext()
      const store = useStore()
      const { teamId } = useTeam()
      useFetch(async () => {
        const query = gql`
          query fetchPlayersPage($teamId: ID!) {
            team(id: $teamId) {
              ...TeamData
              players {
                ...PlayerData
                currentContract { ...ContractData }
              }
            }
          }
          ${teamFragment}
          ${playerFragment}
          ${contractFragment}
        `

        const { team } =
          await $graphql.default.request(query, { teamId: teamId.value })
        const contracts = team.players.map(player => player.currentContract)

        await Promise.all([
          store.$db().model('Team').insert({ data: team }),
          store.$db().model('Contract').insert({ data: contracts })
        ])

        store.commit('app/setPage', {
          title: `${team.name} - Players`,
          headline: 'Players'
        })
      })

      return { teamId }
    }
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="`/teams/${teamId}/statistics/development`"
          nuxt
          color="teal"
          dark
        >
          <v-icon left>mdi-trending-up</v-icon>
          Development
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
        <player-grid />
      </v-col>
    </v-row>
  </v-container>
</template>
