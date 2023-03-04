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

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { teamFragment, competitionFragment } from '@/fragments'

  export default {
    name: 'MatchesPage',
    transition: 'fade-transition',
    data: () => ({
      mode: 'grid'
    }),
    async fetch () {
      const { teamId } = this.$route.query

      if (teamId) {
        const query = gql`
          query fetchMatchesPage($teamId: ID!) {
            team(id: $teamId) {
              ...TeamData
              competitions { ...CompetitionData }
            }
          }
          ${teamFragment}
          ${competitionFragment}
        `

        const { team } =
          await this.$graphql.default.request(query, { teamId: this.teamId })

        await this.$store.$db().model('Team').insert({ data: team })

        this.setPage({
          title: `${team.name} - Matches`,
          headline: 'Matches'
        })
      } else {
        this.$router.push('/')
      }
    },
    computed: {
      teamId () {
        return parseInt(this.$route.query.teamId)
      }
    },
    methods: mapMutations('app', {
      setPage: 'setPage'
    })
  }
</script>
