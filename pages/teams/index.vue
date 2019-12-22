<template lang="pug">
  v-container
    v-row
      v-col
        team-grid
</template>

<script>
  import { mapMutations } from 'vuex'
  import TeamGrid from '@/components/Team/Grid'

  export default {
    name: 'TeamsPage',
    middleware: [
      'authenticated'
    ],
    components: {
      TeamGrid
    },
    transition: 'fade-transition',
    async fetch ({ store }) {
      await store.dispatch('teams/FETCH')
    },
    mounted () {
      this.setPage({
        headline: 'Teams'
      })
    },
    methods: mapMutations('app', {
      setPage: 'SET_PAGE'
    })
  }
</script>
