<template lang="pug">
  v-container(fluid)
    v-row
      v-col
        match-grid
</template>

<script>
  import { mapMutations } from 'vuex'
  import { TeamAccessible } from '@/mixins'
  import MatchGrid from '@/components/Match/Grid'

  export default {
    name: 'MatchesPage',
    components: {
      MatchGrid
    },
    mixins: [
      TeamAccessible
    ],
    middleware: [
      'authenticated'
    ],
    transition: 'fade-transition',
    async fetch ({ store, params }) {
      await Promise.all([
        store.dispatch('matches/FETCH', { teamId: params.teamId }),
        store.dispatch('competitions/FETCH', { teamId: params.teamId })
      ])
    },
    mounted () {
      this.setPage({
        title: `${this.team.title} - Matches`,
        overline: this.team.title,
        headline: 'Matches'
      })
    },
    methods: mapMutations('app', {
      setPage: 'SET_PAGE'
    })
  }
</script>
