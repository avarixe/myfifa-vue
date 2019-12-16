<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <player-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { Component, Vue, namespace } from 'nuxt-property-decorator'
  import { Team } from '@/models'
  import PlayerForm from '@/components/Player/Form'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      PlayerForm
    },
    transition: 'fade-transition'
  })
  export default class NewPlayerPage extends Vue {
    @app.Mutation('SET_PAGE') setPage

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    beforeMount () {
      this.setPage({
        title: `${this.team.title} - New Player`,
        overline: this.team.title,
        headline: 'New Player'
      })
    }
  }
</script>
