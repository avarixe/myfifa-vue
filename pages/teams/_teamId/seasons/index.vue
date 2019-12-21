<template lang="pug">
  v-container(fluid)
    v-row
      v-col
        season-timeline
</template>

<script>
  import { mixins, Component, namespace } from 'nuxt-property-decorator'
  import { TeamAccessible } from '@/mixins'
  import SeasonTimeline from '@/components/Season/Timeline'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
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
