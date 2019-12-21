<template lang="pug">
  v-container(fluid)
    v-row
      v-col
        match-grid
</template>

<script>
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import MatchGrid from '@/components/Match/Grid'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      MatchGrid
    },
    transition: 'fade-transition'
  })
  export default class MatchesPage extends mixins(TeamAccessible) {
    @app.Mutation('SET_PAGE') setPage

    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('matches/FETCH', { teamId: params.teamId }),
        store.dispatch('competitions/FETCH', { teamId: params.teamId })
      ])
    }

    beforeMount () {
      this.setPage({
        title: `${this.team.title} - Matches`,
        overline: this.team.title,
        headline: 'Matches'
      })
    }
  }
</script>
