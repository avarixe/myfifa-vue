<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <competition-form>
          <template #default="{ on }">
            <v-btn v-on="on">
              <v-icon left>mdi-plus-circle-outline</v-icon>
              Competition
            </v-btn>
          </template>
        </competition-form>
      </v-col>

      <v-col cols="12">
        <season-timeline />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import SeasonTimeline from '@/components/Season/Timeline'
  import CompetitionForm from '@/components/Competition/Form'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      CompetitionForm,
      SeasonTimeline
    },
    transition: 'fade-transition'
  })
  export default class SeasonsPage extends mixins(TeamAccessible) {
    @app.Mutation('SET_PAGE') setPage

    async fetch ({ store, params }) {
      await store.dispatch('competitions/FETCH', { teamId: params.teamId })
    }

    beforeMount () {
      this.setPage({
        title: `${this.team.title} - Seasons`,
        overline: this.team.title,
        headline: 'Seasons'
      })
    }
  }
</script>
