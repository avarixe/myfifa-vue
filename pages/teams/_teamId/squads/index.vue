<template lang="pug">
  v-container(fluid)
    v-row
      v-col
        squad-grid
</template>

<script>
  import { mapMutations } from 'vuex'
  import { TeamAccessible } from '@/mixins'
  import SquadGrid from '@/components/Squad/Grid'

  export default {
    components: {
      SquadGrid
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
        store.dispatch('squads/FETCH', { teamId: params.teamId }),
        store.dispatch('players/FETCH', { teamId: params.teamId })
      ])
    },
    mounted () {
      this.setPage({
        title: `${this.team.title} - Squads`,
        overline: this.team.title,
        headline: 'Squads'
      })
    },
    methods: mapMutations('app', {
      setPage: 'SET_PAGE'
    })
  }
</script>
