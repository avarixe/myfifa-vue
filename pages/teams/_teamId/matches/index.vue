<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-tabs
          v-model="mode"
          grow
        >
          <v-tab key="calendar">Calendar</v-tab>
          <v-tab key="grid">Grid</v-tab>
        </v-tabs>

        <v-tabs-items
          v-model="mode"
          touchless
        >
          <v-tab-item key="calendar">
            <match-calendar v-if="!$fetchState.pending" />
          </v-tab-item>
          <v-tab-item key="grid">
            <match-grid />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { teamFragment, matchFragment, competitionFragment } from '@/fragments'

  export default {
    name: 'MatchesPage',
    data: () => ({
      mode: 'calendar'
    }),
    computed: {
      teamId () {
        return parseInt(this.$route.params.teamId)
      }
    },
    async fetch () {
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
        await this.$graphql.default.request(query, { teamId: this.teamId })

      await this.$store.$db().model('Team').insert({ data: team })

      this.setPage({
        title: `${team.name} - Matches`,
        headline: 'Matches'
      })
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
