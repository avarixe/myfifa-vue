<script>
  import { ref, reactive, computed, useContext, useFetch, useRoute, useStore } from '@nuxtjs/composition-api'
  import { gql } from 'nuxt-graphql-request'
  import { useTeam } from '@/composables'
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
    setup () {
      const route = useRoute()
      const pageSeason = computed(() => parseInt(route.value.params.season))

      const { seasonLabel } = useTeam()

      const { $graphql } = useContext()
      const store = useStore()
      const { teamId, season } = useTeam()
      const seasonStats = reactive({
        competitionStats: [],
        playerPerformanceStats: [],
        playerDevelopmentStats: [],
        teamDevelopmentStats: {},
        transferActivity: {}
      })
      useFetch(async () => {
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
          id: parseInt(teamId.value),
          season: parseInt(pageSeason.value)
        })

        await store.$db().model('Team').insert({ data: team })

        const title = `${seasonLabel(pageSeason.value)} Season`
        store.commit('app/setPage', {
          title,
          headline: title
        })

        seasonStats.competitionStats = team.competitionStats
        seasonStats.playerPerformanceStats = team.playerPerformanceStats
        seasonStats.playerDevelopmentStats = team.playerDevelopmentStats
        seasonStats.teamDevelopmentStats = team.teamDevelopmentStats
        seasonStats.transferActivity = team.transferActivity
      })

      return {
        pageSeason,
        seasonStats,
        season,
        tab: ref(0),
        linkToSeason: season => {
          return {
            name: 'teams-teamId-seasons-season',
            params: {
              teamId: teamId.value,
              season
            }
          }
        }
      }
    }
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="linkToSeason(pageSeason - 1)"
          nuxt
          :disabled="pageSeason === 0"
        >
          Previous Season
        </v-btn>
        <v-btn
          :to="linkToSeason(pageSeason + 1)"
          nuxt
          :disabled="pageSeason >= season"
        >
          Next Season
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <season-summary
              :competition-stats="seasonStats.competitionStats"
              :team-development-stats="seasonStats.teamDevelopmentStats"
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
                  :competition-stats="seasonStats.competitionStats"
                />
              </v-tab-item>
              <v-tab-item>
                <season-player-grid
                  :season="pageSeason"
                  :player-performance-stats="seasonStats.playerPerformanceStats"
                  :player-development-stats="seasonStats.playerDevelopmentStats"
                />
              </v-tab-item>
              <v-tab-item>
                <season-transfer-grid
                  :season="pageSeason"
                  :transfer-activity="seasonStats.transferActivity"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
