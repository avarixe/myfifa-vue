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
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import MatchForm from '@/components/Match/Form'
  import MatchGrid from '@/components/Match/Grid'

  @Component({
    components: {
      MatchForm,
      MatchGrid
    },
    transition: 'fade-transition'
  })
  export default class MatchesPage extends mixins(TeamAccessible) {
    layout = () => 'default'
    middleware = () => 'authenticated'

    async fetch ({ store, params }) {
      store.dispatch('matches/FETCH', { teamId: params.teamId })
      store.dispatch('competitions/FETCH', { teamId: params.teamId })
      store.dispatch('stages/TEAM_FETCH', { teamId: params.teamId })
    }

    beforeMount () {
      this.$store.commit('app/SET_PAGE', {
        title: `${this.team.title} - Matches`,
        overline: this.team.title,
        headline: 'Matches'
      })
    }
  }
</script>
