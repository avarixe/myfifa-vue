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
          :to="previousSeasonLink"
          nuxt
          color="blue-grey"
          outlined
        >Previous Season</v-btn>

        <competition-form v-if="pageSeason === season" />

        <v-btn
          v-else
          :to="nextSeasonLink"
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
                <season-results-table :season-data="seasonData" />
              </v-tab-item>
              <v-tab-item>
                <player-grid
                  :season="pageSeason"
                  :season-data="seasonData"
                />
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
    }
  })
  export default class SeasonPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    async asyncData ({ store, params }) {
      const { data } = await store.dispatch('teams/ANALYZE_SEASON', params)
      return {
        seasonData: data
      }
    }

    head () {
      return {
        title: this.title
      }
    }

    get title () {
      return `${this.seasonLabel(this.pageSeason)} Season`
    }

    get pageSeason () {
      return this.$route.params.season
    }

    get previousSeasonLink () {
      return {
        name: 'teams-teamId-seasons-season',
        params: {
          teamId: this.team.id,
          season: this.pageSeason - 1
        }
      }
    }

    get nextSeasonLink () {
      return {
        name: 'teams-teamId-seasons-season',
        params: {
          teamId: this.team.id,
          season: this.pageSeason + 1
        }
      }
    }

    mounted () {
      this.$store.commit('app/SET_TITLE', this.title)
    }
  }
</script>
