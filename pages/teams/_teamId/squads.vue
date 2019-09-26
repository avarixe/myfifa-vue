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
  import { mixins, Component } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import SquadForm from '@/components/Squad/Form'
  import SquadGrid from '@/components/Squad/Grid'

  @Component({
    middleware: ['authenticated'],
    components: {
      SquadForm,
      SquadGrid
    },
    transition: 'fade-transition'
  })
  export default class SquadsPage extends mixins(TeamAccessible) {
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('squads/FETCH', { teamId: params.teamId }),
        store.dispatch('players/FETCH', { teamId: params.teamId })
      ])
    }

    beforeMount () {
      this.$store.commit('app/SET_PAGE', {
        title: `${this.team.title} - Squads`,
        overline: this.team.title,
        headline: 'Squads'
      })
    }
  }
</script>
