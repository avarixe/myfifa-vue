<template>
  <v-container>
    <v-row>
      <v-col>
        <match-grid />
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

      await this.$store.$db().model('Team').insertOrUpdate({ data: team })

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
