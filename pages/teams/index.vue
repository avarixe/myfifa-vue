<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <team-form />
      </v-col>

      <v-col cols="12">
        <team-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { Vue, Component, namespace } from 'nuxt-property-decorator'
  import TeamForm from '@/components/Team/Form'
  import TeamGrid from '@/components/Team/Grid'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      TeamForm,
      TeamGrid
    },
    transition: 'fade-transition'
  })
  export default class TeamsPage extends Vue {
    @app.Mutation('SET_PAGE') setPage

    async fetch ({ store }) {
      await store.dispatch('teams/FETCH')
    }

    beforeMount () {
      this.setPage({
        headline: 'Teams'
      })
    }
  }
</script>
