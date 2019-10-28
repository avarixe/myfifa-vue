<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <squad-form />
      </v-col>

      <v-col cols="12">
        <squad-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import SquadForm from '@/components/Squad/Form'
  import SquadGrid from '@/components/Squad/Grid'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      SquadForm,
      SquadGrid
    },
    transition: 'fade-transition'
  })
  export default class SquadsPage extends mixins(TeamAccessible) {
    @app.Mutation('SET_PAGE') setPage

    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('squads/FETCH', { teamId: params.teamId }),
        store.dispatch('players/FETCH', { teamId: params.teamId })
      ])
    }

    beforeMount () {
      this.setPage({
        title: `${this.team.title} - Squads`,
        overline: this.team.title,
        headline: 'Squads'
      })
    }
  }
</script>
