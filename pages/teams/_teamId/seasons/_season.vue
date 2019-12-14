<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-btn
          v-if="pageSeason > 0"
          :to="linkToSeason(pageSeason - 1)"
          nuxt
        >
          Previous Season
        </v-btn>

        <competition-form v-if="pageSeason === season" />

        <v-btn
          v-else
          :to="linkToSeason(pageSeason + 1)"
          nuxt
        >
          Next Season
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-tabs
              v-model="tab"
              centered
            >
              <v-tab>Summary</v-tab>
              <v-tab>Competitions</v-tab>
              <v-tab>Players</v-tab>
              <v-tab>Transfers</v-tab>
            </v-tabs>

            <v-tabs-items
              v-model="tab"
              touchless
            >
              <v-tab-item>
                <season-summary :season="pageSeason" />
              </v-tab-item>
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
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import CompetitionForm from '@/components/Competition/Form'
  import SeasonSummary from '@/components/Season/Summary'
  import CompetitionGrid from '@/components/Season/CompetitionGrid'
  import PlayerGrid from '@/components/Season/PlayerGrid'
  import TransferGrid from '@/components/Season/TransferGrid'
  import { TeamAccessible } from '@/mixins'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      CompetitionForm,
      SeasonSummary,
      CompetitionGrid,
      PlayerGrid,
      TransferGrid
    },
    transition: 'fade-transition'
  })
  export default class SeasonPage extends mixins(TeamAccessible) {
    @app.Mutation('SET_PAGE') setPage

    head () {
      return {
        title: this.title
      }
    }

    tab = 0

    get title () {
      return `${this.seasonLabel(this.pageSeason)} Season`
    }

    get pageSeason () {
      return parseInt(this.$route.params.season)
    }

    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('competitions/FETCH', { teamId: params.teamId }),
        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('playerHistories/SEARCH', { teamId: params.teamId }),
        store.dispatch('matches/FETCH', { teamId: params.teamId }),
        store.dispatch('contracts/SEARCH', { teamId: params.teamId }),
        store.dispatch('transfers/SEARCH', { teamId: params.teamId })
      ])
    }

    beforeMount () {
      this.setPage({
        title: this.title,
        overline: this.team.title,
        headline: this.title
      })
    }

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
</script>
