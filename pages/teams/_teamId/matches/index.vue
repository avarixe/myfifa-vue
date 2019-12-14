<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <match-form />
      </v-col>

      <v-col cols="12">
        <match-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import MatchForm from '@/components/Match/Form'
  import MatchGrid from '@/components/Match/Grid'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      MatchForm,
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
