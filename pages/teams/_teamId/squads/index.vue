<script>
  import { useContext, useFetch, useStore } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { useTeam } from '@/composables'
  import { teamFragment, squadFragment, playerFragment } from '@/fragments'

  export default {
    name: 'SquadsPage',
    setup () {
      const { $graphql } = useContext()
      const store = useStore()
      const { teamId } = useTeam()
      useFetch(async () => {
        const query = gql`
          query fetchSquadsPage($teamId: ID!) {
            team(id: $teamId) {
              ...TeamData
              squads { ...SquadData }
              players { ...PlayerData }
            }
          }
          ${teamFragment}
          ${squadFragment}
          ${playerFragment}
        `

        const { team } = await $graphql.default.request(query, {
          teamId: teamId.value
        })

        await store.$db().model('Team').insert({ data: team })

        store.commit('app/setPage', {
          title: `${team.name} - Squads`,
          headline: 'Squads'
        })
      })
    }
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <squad-grid />
      </v-col>
    </v-row>
  </v-container>
</template>
