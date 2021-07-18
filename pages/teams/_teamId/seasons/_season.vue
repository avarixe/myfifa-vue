<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          :to="linkToSeason(pageSeason - 1)"
          nuxt
          :disabled="pageSeason === 0"
          v-text="'Previous Season'"
        />
        <v-btn
          :to="linkToSeason(pageSeason + 1)"
          nuxt
          :disabled="pageSeason >= season"
          v-text="'Next Season'"
        />
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <season-summary
              :competition-stats="competitionStats"
              :player-history-stats="playerHistoryStats"
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
                  :player-stats="playerStats"
                  :player-history-stats="playerHistoryStats"
                />
              </v-tab-item>
              <v-tab-item>
                <season-transfer-grid :season="pageSeason" />
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
    competitionFragment,
    competitionStatsFragment,
    playerFragment,
    playerStatsFragment,
    playerHistoryStatsFragment,
    transferFragment
  } from '@/fragments'

  export default {
    name: 'SeasonPage',
    mixins: [
      TeamAccessible
    ],
    computed: {
      title () {
        return `${this.seasonLabel(this.pageSeason)} Season`
      },
      pageSeason () {
        return parseInt(this.$route.params.season)
      }
    },
    async asyncData ({ store, params, $graphql }) {
      const query = gql`
        query fetchSeason($id: ID!, $season: Int) {
          team(id: $id) {
            competitions { ...CompetitionData }
            players {
              ...PlayerData
              transfers { ...TransferData }
            }
            competitionStats(season: $season) { ...CompetitionStatsData }
            playerStats(season: $season) { ...PlayerStatsData }
            playerHistoryStats(season: $season) { ...PlayerHistoryStatsData }
          }
        }
        ${competitionFragment}
        ${playerFragment}
        ${transferFragment}
        ${competitionStatsFragment}
        ${playerStatsFragment}
        ${playerHistoryStatsFragment}
      `

      const { team: {
        competitions,
        players,
        competitionStats,
        playerStats,
        playerHistoryStats
      } } =
        await $graphql.default.request(query, {
          id: parseInt(params.teamId),
          season: parseInt(params.season)
        })

      await Promise.all([
        store.$db().model('Competition').insertOrUpdate({ data: competitions }),
        store.$db().model('Player').insertOrUpdate({ data: players })
      ])

      return {
        competitionStats,
        playerStats,
        playerHistoryStats,
        tab: 0
      }
    },
    async fetch () {
      this.setPage({
        title: this.title,
        headline: this.title
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      linkToSeason (season) {
        return {
          name: 'teams-teamId-seasons-season',
          params: {
            teamId: this.team.id,
            season
          }
        }
      }
    }
  }
</script>
