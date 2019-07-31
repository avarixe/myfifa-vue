<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="overline">{{ team.title }}</div>
        <div class="headline font-weight-thin">{{ title }}</div>
      </v-col>

      <v-col cols="12">
        <v-btn
          v-if="pageSeason > 0"
          :to="linkToSeason(pageSeason - 1)"
          nuxt
          color="blue-grey"
          outlined
        >
          Previous Season
        </v-btn>

        <competition-form v-if="pageSeason === season" />

        <v-btn
          v-else
          :to="linkToSeason(pageSeason + 1)"
          nuxt
          color="blue-grey"
          outlined
        >
          Next Season
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-card outlined>
          <v-card-text>
            <v-tabs centered>
              <v-tab>Competitions</v-tab>
              <v-tab>Players</v-tab>

              <v-tab-item>
                <competition-grid :season="pageSeason" />
              </v-tab-item>
              <v-tab-item>
                <player-grid :season="pageSeason" />
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mixins, Component } from 'nuxt-property-decorator'
  import CompetitionForm from '@/components/Competition/Form'
  import CompetitionGrid from '@/components/Season/CompetitionGrid'
  import PlayerGrid from '@/components/Season/PlayerGrid'
  import { TeamAccessible } from '@/mixins'

  @Component({
    components: {
      CompetitionForm,
      CompetitionGrid,
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

    async fetch ({ store, params }) {
      console.log('in _season.vue fetch')
      await Promise.all([
        store.dispatch('competitions/FETCH', { teamId: params.teamId }),
        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('playerHistories/SEARCH', { teamId: params.teamId }),
        store.dispatch('matches/FETCH', { teamId: params.teamId }),
        store.dispatch('caps/SEARCH', { teamId: params.teamId }),
        store.dispatch('goals/SEARCH', { teamId: params.teamId }),
        store.dispatch('contracts/TEAM_FETCH', { teamId: params.teamId })
      ])
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
