<script>
  import { ref, useContext, useFetch, useStore } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { useTeam } from '@/composables'
  import { teamFragment, matchFragment, competitionFragment } from '@/fragments'

  export default {
    name: 'MatchesPage',
    setup () {
      const { $graphql } = useContext()
      const store = useStore()
      const { teamId } = useTeam()
      useFetch(async () => {
        const query = gql`
          query fetchMatchesPage($teamId: ID!) {
            team(id: $teamId) {
              ...TeamData
              matches { ...MatchData }
              competitions { ...CompetitionData }
            }
          }
          ${teamFragment}
          ${matchFragment}
          ${competitionFragment}
        `

        const { team } =
          await $graphql.default.request(query, { teamId: teamId.value })

        await store.$db().model('Team').insert({ data: team })

        store.commit('app/setPage', {
          title: `${team.name} - Matches`,
          headline: 'Matches'
        })
      })

      return {
        mode: ref('grid')
      }
    }
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-tabs
          v-model="mode"
          grow
        >
          <v-tab key="grid">Grid</v-tab>
          <v-tab key="calendar">Calendar</v-tab>
        </v-tabs>

        <v-tabs-items
          v-model="mode"
          touchless
        >
          <v-tab-item key="grid">
            <match-grid />
          </v-tab-item>
          <v-tab-item key="calendar">
            <match-calendar />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>
