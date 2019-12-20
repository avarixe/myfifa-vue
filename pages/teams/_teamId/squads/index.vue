<template lang="pug">
  v-container(fluid)
    v-row
      v-col
        squad-grid
</template>

<script>
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import SquadGrid from '@/components/Squad/Grid'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
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
