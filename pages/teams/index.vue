<template lang="pug">
  v-container
    v-row
      v-col
        team-grid
</template>

<script>
  import { Vue, Component, namespace } from 'nuxt-property-decorator'
  import TeamGrid from '@/components/Team/Grid'

  const app = namespace('app')

  @Component({
    middleware: ['authenticated'],
    components: {
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
