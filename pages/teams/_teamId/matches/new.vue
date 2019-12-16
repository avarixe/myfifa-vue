<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <match-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { Component, Vue, namespace } from 'nuxt-property-decorator'
  import { Team } from '@/models'
  import MatchForm from '@/components/Match/Form'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      MatchForm
    },
    transition: 'fade-transition'
  })
  export default class NewMatchPage extends Vue {
    @app.Mutation('SET_PAGE') setPage

    async asyncData ({ store, params }) {
      const { data } = await store.dispatch('matches/FETCH_TEAMS', {
        teamId: params.teamId
      })
      console.log(data)
    }

    async fetch ({ store, params }) {
      await store.dispatch('competitions/FETCH', { teamId: params.teamId })
    }

    get team () {
      return Team.find(this.$route.params.teamId)
    }

    beforeMount () {
      this.setPage({
        title: `${this.team.title} - New Match`,
        overline: this.team.title,
        headline: 'New Match'
      })
    }
  }
</script>
