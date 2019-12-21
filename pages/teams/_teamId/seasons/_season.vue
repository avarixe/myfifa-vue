<template lang="pug">
  v-container(fluid)
    v-row
      v-col(cols="12")
        v-btn(
          :to="linkToSeason(pageSeason - 1)"
          nuxt
          :disabled="pageSeason === 0"
        ) Previous Season
        |&nbsp;
        v-btn(
          :to="linkToSeason(pageSeason + 1)"
          nuxt
          :disabled="pageSeason >= season"
        ) Next Season
      v-col(cols="12")
        v-card
          v-card-text
            v-tabs(v-model="tab" centered)
              v-tab Competitions
              v-tab Players
            v-tabs-items(v-model="tab" touchless)
              v-tab-item
                competition-grid(:season="pageSeason")
              v-tab-item
                player-grid(:season="pageSeason")
</template>

<script>
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import CompetitionGrid from '@/components/Season/CompetitionGrid'
  import PlayerGrid from '@/components/Season/PlayerGrid'
  import { TeamAccessible } from '@/mixins'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      CompetitionGrid,
      PlayerGrid
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
        store.dispatch('contracts/SEARCH', { teamId: params.teamId })
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
