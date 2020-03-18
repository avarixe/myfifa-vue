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
  import { mapMutations, mapActions } from 'vuex'
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
    async fetch () {
      await Promise.all([
        this.fetchPlayers({ teamId: this.team.id }),
        this.searchContracts({ teamId: this.team.id })
      ])
      this.setPage({
        title: `${this.team.title} - Players`,
        overline: this.team.title,
        headline: 'Players'
      })
    },
    methods: {
      ...mapMutations('app', {
        setPage: 'SET_PAGE'
      }),
      ...mapActions({
        fetchPlayers: 'players/FETCH',
        searchContracts: 'contracts/SEARCH'
      })
    }
  }
</script>
