<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <player-grid />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { TeamAccessible } from '@/mixins'
  import PlayerGrid from '@/components/Player/Grid'

  export default {
    name: 'PlayersPage',
    components: {
      PlayerGrid
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
        store.dispatch('players/FETCH', { teamId: params.teamId }),
        store.dispatch('contracts/SEARCH', { teamId: params.teamId })
      ])
    },
    mounted () {
      this.setPage({
        title: `${this.team.title} - Players`,
        overline: this.team.title,
        headline: 'Players'
      })
    },
    methods: mapMutations('app', {
      setPage: 'SET_PAGE'
    })
  }
</script>
