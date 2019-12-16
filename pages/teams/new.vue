<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <team-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { Component, Vue, namespace } from 'nuxt-property-decorator'
  import TeamForm from '@/components/Team/Form'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      TeamForm
    },
    transition: 'fade-transition'
  })
  export default class NewTeamPage extends Vue {
    @app.Mutation('SET_PAGE') setPage

    beforeMount () {
      this.setPage({
        title: 'New Team',
        headline: 'New Team'
      })
    }
  }
</script>
