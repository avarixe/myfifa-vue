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
            <!-- <season-summary
              :season-start="seasonStart"
              :season-end="seasonEnd"
              :season-data="seasonData"
            /> -->
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
                <!-- <season-competition-grid
                  :season="pageSeason"
                  :results="seasonData.results"
                /> -->
              </v-tab-item>
              <v-tab-item>
                <!-- <season-player-grid
                  :season-start="seasonStart"
                  :season-end="seasonEnd"
                  :season-data="seasonData"
                /> -->
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
  import { mapMutations, mapActions } from 'vuex'
  import { gql } from 'nuxt-graphql-request'
  import { addYears, format, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'
  import {
    competitionFragment,
    playerFragment,
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
      },
      seasonStart () {
        let date = parseISO(this.team.startedOn)
        date = addYears(date, parseInt(this.pageSeason))
        return format(date, 'yyyy-MM-dd')
      },
      seasonEnd () {
        let date = parseISO(this.team.startedOn)
        date = addYears(date, parseInt(this.pageSeason) + 1)
        return format(date, 'yyyy-MM-dd')
      }
    },
    // async asyncData ({ params, store }) {
    //   const seasonData = await store.dispatch('teams/analyzeSeason', {
    //     teamId: params.teamId,
    //     season: params.season
    //   })
    //   return {
    //     seasonData,
    //     tab: 0
    //   }
    // },
    async fetch () {
      this.setPage({
        title: this.title,
        headline: this.title
      })

      const query = gql`
        query fetchSeason($id: ID!) {
          team(id: $id) {
            id
            competitions { ...CompetitionData }
            players {
              ...PlayerData
              transfers { ...TransferData }
            }
          }
        }
        ${competitionFragment}
        ${playerFragment}
        ${transferFragment}
      `

      await this.getTeam({ id: this.team.id, query })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      ...mapActions({
        getTeam: 'teams/get'
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
