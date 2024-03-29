<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="linkToSeason(pageSeason - 1)"
          nuxt
          exact
          :disabled="pageSeason === 0"
        >
          Previous Season
        </v-btn>
        <v-btn
          :to="linkToSeason(pageSeason + 1)"
          nuxt
          exact
          :disabled="pageSeason >= season"
        >
          Next Season
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <season-summary
              :competition-stats="competitionStats"
              :team-development-stats="teamDevelopmentStats"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-tabs
              v-model="tab"
              centered
            >
              <v-tab>Competitions</v-tab>
              <v-tab>Players</v-tab>
              <v-tab>Transfers</v-tab>
            </v-tabs>
            <v-tabs-items
              v-model="tab"
              touchless
            >
              <v-tab-item>
                <season-competition-grid
                  :season="pageSeason"
                  :competition-stats="competitionStats"
                />
              </v-tab-item>
              <v-tab-item>
                <season-player-grid
                  :season="pageSeason"
                  :player-performance-stats="playerPerformanceStats"
                  :player-development-stats="playerDevelopmentStats"
                />
              </v-tab-item>
              <v-tab-item>
                <season-transfer-grid
                  :season="pageSeason"
                  :transfer-activity="transferActivity"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { TeamAccessible } from '@/mixins'
  import {
    teamFragment,
    competitionFragment,
    competitionStatsFragment,
    playerFragment,
    playerPerformanceStatsFragment,
    playerDevelopmentStatsFragment,
    teamDevelopmentStatsFragment,
    contractFragment,
    transferFragment,
    loanFragment
  } from '@/fragments'

  export default {
    name: 'SeasonPage',
    key: to => to.fullPath,
    mixins: [
      TeamAccessible
    ],
    transition (to, from) {
      if (from && from.query.season) {
        return `scroll-x${+to.query.season < +from.query.season ? '' : '-reverse'}-transition`
      } else {
        return 'fade-transition'
      }
    },
    async asyncData ({ store, route, $graphql, redirect }) {
      const { teamId, season } = route.query

      if (teamId && !isNaN(season)) {
        const query = gql`
          query fetchSeason($id: ID!, $season: Int!) {
            team(id: $id) {
              ...TeamData
              competitions { ...CompetitionData }
              players { ...PlayerData }
              competitionStats(season: $season) { ...CompetitionStatsData }
              playerPerformanceStats(season: $season) { ...PlayerPerformanceStatsData }
              playerDevelopmentStats(season: $season) { ...PlayerDevelopmentStatsData }
              teamDevelopmentStats(season: $season) { ...TeamDevelopmentStatsData }
              transferActivity(season: $season) {
                arrivals { ...ContractData }
                departures { ...ContractData }
                transfers { ...TransferData }
                loans { ...LoanData }
              }
            }
          }
          ${teamFragment}
          ${competitionFragment}
          ${playerFragment}
          ${competitionStatsFragment}
          ${playerPerformanceStatsFragment}
          ${playerDevelopmentStatsFragment}
          ${teamDevelopmentStatsFragment}
          ${contractFragment}
          ${transferFragment}
          ${loanFragment}
        `

        const { team } = await $graphql.default.request(query, {
          id: parseInt(route.query.teamId),
          season: parseInt(route.query.season)
        })

        await store.$db().model('Team').insert({ data: team })

        const {
          competitionStats,
          playerPerformanceStats,
          playerDevelopmentStats,
          teamDevelopmentStats,
          transferActivity
        } = team

        return {
          competitionStats,
          playerPerformanceStats,
          playerDevelopmentStats,
          teamDevelopmentStats,
          transferActivity,
          tab: 0
        }
      } else if (teamId) {
        redirect({ name: 'team', query: { teamId } })
      } else {
        redirect('/')
      }
    },
    async fetch () {
      this.setPage({
        title: this.title,
        headline: this.title
      })
    },
    computed: {
      title () {
        return `${this.seasonLabel(this.pageSeason)} Season`
      },
      pageSeason () {
        return parseInt(this.$route.query.season)
      }
    },
    watch: {
      '$route.query': '$fetch'
    },
    watchQuery: ['season'],
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      linkToSeason (season) {
        return {
          name: 'season',
          query: {
            teamId: this.team.id,
            season
          }
        }
      }
    }
  }
</script>
