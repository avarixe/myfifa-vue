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
            <season-summary :season="pageSeason" />
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
                <competition-grid :season="pageSeason" />
              </v-tab-item>
              <v-tab-item>
                <player-grid :season="pageSeason" />
              </v-tab-item>
              <v-tab-item>
                <transfer-grid :season="pageSeason" />
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
  import CompetitionGrid from '@/components/Season/CompetitionGrid'
  import PlayerGrid from '@/components/Season/PlayerGrid'
  import TransferGrid from '@/components/Season/TransferGrid'
  import SeasonSummary from '@/components/Season/Summary'
  import { TeamAccessible } from '@/mixins'

  export default {
    name: 'SeasonPage',
    components: {
      CompetitionGrid,
      PlayerGrid,
      TransferGrid,
      SeasonSummary
    },
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    data: () => ({
      tab: 0
    }),
    computed: {
      title () {
        return `${this.seasonLabel(this.pageSeason)} Season`
      },
      pageSeason () {
        return parseInt(this.$route.params.season)
      }
    },
    async fetch () {
      await Promise.all([
        this.fetchCompetitions({ teamId: this.team.id }),
        this.fetchPlayers({ teamId: this.team.id }),
        this.fetchMatches({ teamId: this.team.id }),
        this.searchPlayerHistories({ teamId: this.team.id }),
        this.searchContracts({ teamId: this.team.id }),
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
        setPage: 'SET_PAGE'
      }),
      ...mapActions({
        fetchCompetitions: 'competitions/FETCH',
        fetchPlayers: 'players/FETCH',
        fetchMatches: 'matches/FETCH',
        searchPlayerHistories: 'playerHistories/SEARCH',
        searchContracts: 'contracts/SEARCH',
        searchTransfers: 'transfers/SEARCH'
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
