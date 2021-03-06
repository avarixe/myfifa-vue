<template>
  <v-container fluid>
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
              :season-start="seasonStart"
              :season-end="seasonEnd"
              :season-data="seasonData"
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
                  :results="seasonData.results"
                />
              </v-tab-item>
              <v-tab-item>
                <season-player-grid
                  :season-start="seasonStart"
                  :season-end="seasonEnd"
                  :season-data="seasonData"
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
  import { mapMutations, mapActions } from 'vuex'
  import { addYears, format, parseISO } from 'date-fns'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'SeasonPage',
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    computed: {
      title () {
        return `${this.seasonLabel(this.pageSeason)} Season`
      },
      pageSeason () {
        return parseInt(this.$route.params.season)
      },
      seasonStart () {
        let date = parseISO(this.team.started_on)
        date = addYears(date, parseInt(this.pageSeason))
        return format(date, 'yyyy-MM-dd')
      },
      seasonEnd () {
        let date = parseISO(this.team.started_on)
        date = addYears(date, parseInt(this.pageSeason) + 1)
        return format(date, 'yyyy-MM-dd')
      }
    },
    async asyncData ({ params, store }) {
      const seasonData = await store.dispatch('teams/analyzeSeason', {
        teamId: params.teamId,
        season: params.season
      })
      return {
        seasonData,
        tab: 0
      }
    },
    async fetch () {
      await Promise.all([
        this.fetchCompetitions({ teamId: this.team.id }),
        this.fetchPlayers({ teamId: this.team.id }),
        this.searchTransfers({ teamId: this.team.id })
      ])
      this.setPage({
        title: this.title,
        overline: this.team.title,
        headline: this.title
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'setPage'
      }),
      ...mapActions({
        fetchCompetitions: 'competitions/fetch',
        fetchPlayers: 'players/fetch',
        searchTransfers: 'transfers/search'
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
    },
    head () {
      return {
        title: this.title
      }
    }
  }
</script>
