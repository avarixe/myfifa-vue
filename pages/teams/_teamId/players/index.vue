<template lang="pug">
  v-container(fluid)
    v-row
      v-col
        player-grid
</template>

<script>
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import PlayerGrid from '@/components/Player/Grid'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
      PlayerGrid
    },
    transition: 'fade-transition'
  })
  export default class PlayersPage extends mixins(TeamAccessible) {
    @app.Mutation('SET_PAGE') setPage

    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('contracts/SEARCH', { teamId: params.teamId })
      ])
    }

    beforeMount () {
      this.setPage({
        title: `${this.team.title} - Players`,
        overline: this.team.title,
        headline: 'Players'
      })
    }
  }
</script>
