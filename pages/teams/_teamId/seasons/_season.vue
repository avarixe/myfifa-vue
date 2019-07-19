<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout wrap>
      <v-flex xs12>
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">{{ title }}</div>
      </v-flex>

      <v-flex xs12>
        <v-btn
          v-if="pageSeason > 0"
          :to="linkToSeason(pageSeason - 1)"
          nuxt
          color="blue-grey"
          outlined
        >Previous Season</v-btn>

        <competition-form v-if="pageSeason === season" />

        <v-btn
          v-else
          :to="linkToSeason(pageSeason + 1)"
          nuxt
          color="blue-grey"
          outlined
        >Next Season</v-btn>
      </v-flex>

      <v-flex xs12>
        <v-card outlined>
          <v-card-text>
            <v-tabs centered>
              <v-tab>Competitions</v-tab>
              <v-tab>Players</v-tab>

              <v-tab-item>
                <season-results-table :season="pageSeason" />
              </v-tab-item>
              <v-tab-item>
                <player-grid :season="pageSeason" />
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import CompetitionForm from '@/components/Competition/Form'
  import SeasonResultsTable from '@/components/Season/ResultsTable'
  import PlayerGrid from '@/components/Season/PlayerGrid'
  import { TeamAccessible } from '@/mixins'

  @Component({
    components: {
      CompetitionForm,
      SeasonResultsTable,
      PlayerGrid
    },
    transition: 'fade-transition'
  })
  export default class SeasonPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    head () {
      return {
        title: this.title
      }
    }

    get title () {
      return `${this.seasonLabel(this.pageSeason)} Season`
    }

    get pageSeason () {
      return parseInt(this.$route.params.season)
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.title)
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
